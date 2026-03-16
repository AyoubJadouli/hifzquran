# 14 — AUDIO ENGINE

> The core technical component. Covers the playback service (nested repetition loop), background audio handler, ambient mixer, and DSP pipeline.

---

## 1. AUDIO ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                        FLUTTER LAYER                            │
│                                                                 │
│  PlaybackService (orchestrator)                                 │
│    ├─→ manages nested repetition loop                           │
│    ├─→ sends commands to HifzAudioHandler                       │
│    ├─→ updates PlaybackState provider                           │
│    └─→ handles auto-advance, shuffle, sleep timer               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HifzAudioHandler (extends BaseAudioHandler)                    │
│    ├─→ wraps AudioPlayer (just_audio) for recitation            │
│    ├─→ wraps AudioPlayer (just_audio) for ambient               │
│    ├─→ exposes MediaSession controls (play/pause/stop/seek)     │
│    ├─→ updates MediaItem metadata (surah, verse, recording)     │
│    └─→ manages audio focus + headset events                     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                        PLATFORM LAYER                           │
│                                                                 │
│  Android: Foreground Service + MediaSession + MediaStyle notif  │
│  iOS: AVAudioSession (background mode) + Remote Command Center  │
│  (handled automatically by audio_service + just_audio packages) │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. PLAYBACK SERVICE — NESTED REPETITION ENGINE

This is the **most critical algorithm** in the entire app.

### 2.1 Pseudocode

```
class PlaybackService:
    AudioPlayer recitationPlayer
    AudioPlayer ambientPlayer
    PlaybackState state
    bool _isPlaying = false
    Timer? _sleepTimer

    async startPlayback(chunk, recording, settings):
        _isPlaying = true
        state = state.copyWith(status: playing, activeChunkId: chunk.id)

        // Start ambient if configured
        if settings.ambience != 'none':
            startAmbient(settings.ambience, settings.ambienceVolume)

        // Start sleep timer if configured
        if settings.sleepTimerMinutes > 0:
            _sleepTimer = Timer(Duration(minutes: settings.sleepTimerMinutes), fadeAndStop)

        chunkRepCount = 0

        // ═══ OUTER LOOP: CHUNK REPETITIONS ═══
        while _isPlaying AND (chunkRepCount < settings.chunkRepetition OR settings.chunkRepetition == 0):

            verseOrder = settings.shuffle
                ? List.from(recording.verseFiles)..shuffle()
                : recording.verseFiles

            // ═══ MIDDLE LOOP: EACH VERSE ═══
            for verseIndex in 0..verseOrder.length:
                if NOT _isPlaying: break

                currentVerse = verseOrder[verseIndex]
                state = state.copyWith(currentVerseIndex: verseIndex, verseRepCount: 0)
                notifyListeners()     // triggers auto-scroll on Home Page

                verseRepCount = 0

                // ═══ INNER LOOP: VERSE REPETITIONS ═══
                while _isPlaying AND verseRepCount < settings.verseRepetition:

                    // Load and play verse audio
                    await recitationPlayer.setFilePath(currentVerse.filePath)
                    await recitationPlayer.setSpeed(settings.speed)
                    recitationPlayer.play()

                    // Update elapsed/total
                    recitationPlayer.positionStream.listen((position) {
                        state = state.copyWith(
                            elapsed: position,
                            total: recitationPlayer.duration ?? Duration.zero,
                        )
                    })

                    // Wait for verse audio to complete
                    await recitationPlayer.playerStateStream.firstWhere(
                        (s) => s.processingState == ProcessingState.completed
                    )

                    if NOT _isPlaying: break
                    verseRepCount++
                    state = state.copyWith(verseRepCount: verseRepCount)

                    // Inter-verse gap (silence between repetitions)
                    if _isPlaying AND verseRepCount < settings.verseRepetition:
                        await Future.delayed(Duration(
                            milliseconds: (settings.interVerseGap * 1000).toInt()
                        ))

                // END inner loop

                // Gap before next verse
                if _isPlaying AND verseIndex < verseOrder.length - 1:
                    await Future.delayed(Duration(
                        milliseconds: (settings.interVerseGap * 1000).toInt()
                    ))

            // END middle loop

            chunkRepCount++
            state = state.copyWith(chunkRepCount: chunkRepCount)

            // Auto-advance to next chunk
            if _isPlaying AND settings.autoAdvance AND isLastChunkRep(chunkRepCount, settings):
                nextChunk = getNextChunk(chunk)
                if nextChunk != null:
                    nextRecording = getDefaultRecording(nextChunk)
                    if nextRecording != null:
                        chunk = nextChunk
                        recording = nextRecording
                        chunkRepCount = 0   // reset for new chunk
                        state = state.copyWith(activeChunkId: nextChunk.id)
                        // loop continues
                    else:
                        break   // next chunk has no recordings
                else:
                    break       // no more chunks

        // END outer loop

        _isPlaying = false
        state = state.copyWith(status: idle)
        stopAmbient()


    pausePlayback():
        recitationPlayer.pause()
        state = state.copyWith(status: paused)

    resumePlayback():
        recitationPlayer.play()
        state = state.copyWith(status: playing)

    stopPlayback():
        _isPlaying = false
        recitationPlayer.stop()
        stopAmbient()
        _sleepTimer?.cancel()
        state = PlaybackState()   // reset to idle

    seekTo(Duration position):
        recitationPlayer.seek(position)

    skipToNextVerse():
        // Reset verse rep counter, advance verseIndex
        // Implementation: set a flag that the inner/middle loop checks

    skipToPrevVerse():
        // Reset verse rep counter, go back one verseIndex

    setSpeed(double speed):
        recitationPlayer.setSpeed(speed)
        state = state.copyWith(speed: speed)

    fadeAndStop():
        // Sleep timer expiry — fade volume over 3 seconds
        for step in 0..20:
            volume = 1.0 - (step / 20.0)
            recitationPlayer.setVolume(volume)
            ambientPlayer.setVolume(volume * ambienceVolumeRatio)
            await Future.delayed(Duration(milliseconds: 150))
        stopPlayback()
```

### 2.2 Total Plays Formula

```
Total plays per verse = verseRepetition × chunkRepetition

Example:
  Verse rep = 3, Chunk rep = 5
  → Each verse played 15 times per session

  Verse rep = 3, Chunk rep = ∞ (0)
  → Each verse played 3 times per chunk loop, looping infinitely
  → Until user manually stops or sleep timer fires
```

---

## 3. BACKGROUND AUDIO HANDLER

```dart
class HifzAudioHandler extends BaseAudioHandler with SeekHandler {
  final AudioPlayer _recitationPlayer = AudioPlayer();
  final AudioPlayer _ambientPlayer = AudioPlayer();

  @override
  Future<void> play() async {
    playbackState.add(playbackState.value.copyWith(
      playing: true,
      controls: [
        MediaControl.skipToPrevious,
        MediaControl.pause,
        MediaControl.stop,
        MediaControl.skipToNext,
      ],
      systemActions: {MediaAction.seek},
      processingState: AudioProcessingState.ready,
    ));
    await _recitationPlayer.play();
  }

  @override
  Future<void> pause() async {
    playbackState.add(playbackState.value.copyWith(
      playing: false,
      controls: [MediaControl.play, MediaControl.stop],
    ));
    await _recitationPlayer.pause();
  }

  @override
  Future<void> stop() async {
    await _recitationPlayer.stop();
    await _ambientPlayer.stop();
    playbackState.add(playbackState.value.copyWith(
      playing: false,
      processingState: AudioProcessingState.idle,
    ));
  }

  @override
  Future<void> seek(Duration position) async {
    await _recitationPlayer.seek(position);
  }

  @override
  Future<void> skipToNext() async {
    // Triggers skipToNextVerse in PlaybackService
  }

  @override
  Future<void> skipToPrevious() async {
    // Triggers skipToPrevVerse in PlaybackService
  }

  void updateMediaItem(String surahName, int verseNum, String recordingName) {
    mediaItem.add(MediaItem(
      id: 'hifz_current',
      title: '$surahName · Verse $verseNum',
      artist: 'Hifz Companion',
      album: recordingName,
      duration: _recitationPlayer.duration,
      artUri: Uri.parse('asset:///assets/icon/app_icon.png'),
    ));
  }
}
```

### Lock Screen & Notification

| Platform | Implementation |
|----------|----------------|
| **Android** | `MediaStyle` notification with play/pause/stop/skip. Foreground service keeps audio alive. |
| **iOS** | Control Center integration via `MPRemoteCommandCenter`. `AVAudioSession` category `.playback` with background mode enabled. |
| **Both** | Metadata updates on each verse change. Headset button: single press = play/pause, double press = skip next. |

---

## 4. AMBIENT MIXER

```dart
class AmbientMixer {
  final AudioPlayer _player = AudioPlayer();
  String? _currentAmbience;

  Future<void> start(String ambience, int volumePercent) async {
    if (ambience == 'none') return;

    final assetPath = _getAssetPath(ambience);
    await _player.setAsset(assetPath);
    await _player.setLoopMode(LoopMode.all);   // infinite loop
    await _player.setVolume(volumePercent / 100.0);
    await _player.play();
    _currentAmbience = ambience;
  }

  Future<void> stop() async {
    await _player.stop();
    _currentAmbience = null;
  }

  Future<void> crossfadeTo(String newAmbience, int volumePercent) async {
    // Fade out current over 500ms, then start new
    if (_currentAmbience != null) {
      for (int i = 10; i >= 0; i--) {
        _player.setVolume((i / 10.0) * (volumePercent / 100.0));
        await Future.delayed(Duration(milliseconds: 50));
      }
      await _player.stop();
    }
    await start(newAmbience, volumePercent);
  }

  void setVolume(int volumePercent) {
    _player.setVolume(volumePercent / 100.0);
  }

  String _getAssetPath(String ambience) {
    switch (ambience) {
      case 'rain': return 'assets/audio/ambient/rain_moderate.mp3';
      case 'nature': return 'assets/audio/ambient/nature_forest.mp3';
      case 'ocean': return 'assets/audio/ambient/ocean_waves.mp3';
      case 'white': return 'assets/audio/ambient/white_noise.mp3';
      case 'night': return 'assets/audio/ambient/night_crickets.mp3';
      default: return '';
    }
  }
}
```

**Ambient assets**: Pre-loaded, compressed, seamlessly loopable `.mp3` files (~1-2 MB each).

---

## 5. RECORDING SERVICE

```dart
class RecordingService {
  final AudioRecorder _recorder = AudioRecorder();
  String? _currentFilePath;

  Future<bool> hasPermission() async {
    return await _recorder.hasPermission();
  }

  Future<void> start() async {
    final directory = await getApplicationDocumentsDirectory();
    _currentFilePath = '${directory.path}/verse_${DateTime.now().millisecondsSinceEpoch}.m4a';

    await _recorder.start(
      RecordConfig(
        encoder: AudioEncoder.aacLc,
        bitRate: 128000,
        sampleRate: 44100,
      ),
      path: _currentFilePath!,
    );
  }

  Future<String> stop() async {
    await _recorder.stop();
    return _currentFilePath!;
  }

  Stream<double>? get amplitudeStream {
    // Returns normalized amplitude 0.0-1.0 for waveform visualization
    // Implementation depends on record package version
    return _recorder.onAmplitudeChanged(Duration(milliseconds: 100))
        ?.map((amp) => (amp.current + 60) / 60);  // normalize dBFS to 0-1
  }

  Future<void> dispose() async {
    await _recorder.dispose();
  }
}
```

---

## 6. AUDIO FOCUS & INTERRUPTIONS

| Event | Behavior |
|-------|----------|
| **Incoming phone call** | Pause playback + ambient. Auto-resume when call ends (configurable in settings). |
| **Navigation prompt** | Duck volume to 30% during prompt. Restore after. |
| **Other app plays audio** | Pause. Do NOT auto-resume (user chose another app). |
| **Headphones disconnected** | Pause immediately. |
| **Headphones reconnected** | Auto-resume (configurable in settings). |
| **Alarm / Timer** | Pause. Auto-resume after alarm dismissed. |
| **Screen off** | Continue playing (core feature). |
| **App backgrounded** | Continue playing via foreground service / AVAudioSession. |
| **App killed** | Audio stops (no resurrection in v1.0 — future: persistent foreground service). |

---

## 7. AUDIO PROCESSING CHAIN (v1.0)

```
Input (recorded .m4a file)
  │
  ├─→ just_audio AudioPlayer
  │     ├─→ Speed adjustment (0.5x–2.0x, pitch preserved)
  │     └─→ Volume control
  │
  └─→ Output to system audio
        │
        ├─→ + Ambient audio (mixed by separate AudioPlayer)
        │
        └─→ Headphones / Speaker
```

**v2.0+ (future)**: Native DSP via Platform Channels:

```
Input → EQ → Compression → Reverb → Ambient Mixer → Output
  │
  Android: ExoPlayer + AudioEffect API (Equalizer, BassBoost, Reverb)
  iOS: AVAudioEngine + AudioUnit framework (reverb/EQ units)
  Flutter Bridge: MethodChannel for bidirectional DSP control
```

---

## 8. SLEEP TIMER

```
User sets sleep timer (15m / 30m / 1h / 2h)
  │
  ├─→ Timer starts (runs in background, survives screen-off)
  │
  ├─→ Timer expires:
  │     ├─→ Volume fades: 1.0 → 0.0 over 3 seconds (linear, 150ms steps)
  │     ├─→ Stop recitation player
  │     ├─→ Stop ambient player
  │     ├─→ Update playback state → idle
  │     └─→ Clear notification
  │
  └─→ Timer cancelled (user taps stop or changes timer):
        └─→ Cancel timer, no action
```
