# 02 — DATA MODELS

> Complete Dart model definitions (Freezed), JSON schemas, Hive type adapters, and repository interfaces.

---

## 1. QURAN DATA (JSON Asset)

### Schema: `assets/data/quran.json`

```json
{
  "surahs": [
    {
      "number": 1,
      "name_arabic": "الفاتحة",
      "name_english": "Al-Fatihah",
      "name_transliteration": "Al-Fātiḥah",
      "english_meaning": "The Opening",
      "total_verses": 7,
      "revelation_type": "Meccan",
      "revelation_order": 5,
      "verses": [
        {
          "number": 1,
          "arabic": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
          "transliteration": "Bismillāhi r-raḥmāni r-raḥīm",
          "translations": {
            "en": "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
            "fr": "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.",
            "tr": "Rahman ve Rahim olan Allah'ın adıyla",
            "ur": "شروع الله کا نام لے کر جو بڑا مہربان نہایت رحم والا ہے",
            "id": "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang."
          },
          "tafsir": {
            "en": "This verse is known as the Basmalah..."
          }
        }
      ]
    }
  ]
}
```

---

## 2. DART MODELS (Freezed)

### 2.1 Surah

```dart
@freezed
class Surah with _$Surah {
  const factory Surah({
    required int number,
    required String nameArabic,
    required String nameEnglish,
    required String nameTransliteration,
    required String englishMeaning,
    required int totalVerses,
    required String revelationType,    // "Meccan" | "Medinan"
    required int revelationOrder,
    required List<Verse> verses,
  }) = _Surah;

  factory Surah.fromJson(Map<String, dynamic> json) => _$SurahFromJson(json);
}
```

### 2.2 Verse

```dart
@freezed
class Verse with _$Verse {
  const factory Verse({
    required int number,
    required String arabic,
    required String transliteration,
    required Map<String, String> translations,
    @Default({}) Map<String, String> tafsir,
  }) = _Verse;

  factory Verse.fromJson(Map<String, dynamic> json) => _$VerseFromJson(json);
}
```

### 2.3 Chunk (Hive-persisted)

```dart
@freezed
@HiveType(typeId: 0)
class Chunk with _$Chunk {
  const factory Chunk({
    @HiveField(0) required String id,           // format: "{surahNum}-chunk-{index}"
    @HiveField(1) required int surahNumber,
    @HiveField(2) required int startVerse,
    @HiveField(3) required int endVerse,
    @HiveField(4) required int chunkIndex,       // 0-based position within surah
    @HiveField(5) @Default('notStarted') String status,  // notStarted | inProgress | completed
    @HiveField(6) DateTime? lastAccessed,
    @HiveField(7) @Default(0) int totalChunksInSurah,
  }) = _Chunk;

  factory Chunk.fromJson(Map<String, dynamic> json) => _$ChunkFromJson(json);
}
```

**Status transitions:**

```
notStarted ──→ inProgress (first recording saved for this chunk)
inProgress ──→ completed  (user marks as memorized, or auto via playback threshold)
completed  ──→ inProgress (user resets)
```

### 2.4 Recording (Hive-persisted)

```dart
@freezed
@HiveType(typeId: 1)
class Recording with _$Recording {
  const factory Recording({
    @HiveField(0) required String id,            // UUID v4
    @HiveField(1) required String chunkId,       // FK to Chunk.id
    @HiveField(2) required String name,          // user-entered name
    @HiveField(3) required DateTime createdAt,
    @HiveField(4) required List<VerseAudio> verseFiles,
    @HiveField(5) required int totalDurationMs,
  }) = _Recording;

  factory Recording.fromJson(Map<String, dynamic> json) => _$RecordingFromJson(json);
}
```

### 2.5 VerseAudio

```dart
@freezed
@HiveType(typeId: 2)
class VerseAudio with _$VerseAudio {
  const factory VerseAudio({
    @HiveField(0) required int verseNumber,
    @HiveField(1) required String filePath,      // absolute path to .m4a
    @HiveField(2) required int durationMs,
  }) = _VerseAudio;

  factory VerseAudio.fromJson(Map<String, dynamic> json) => _$VerseAudioFromJson(json);
}
```

### 2.6 UserSettings (Hive-persisted)

```dart
@freezed
@HiveType(typeId: 3)
class UserSettings with _$UserSettings {
  const factory UserSettings({
    // Chunk config
    @HiveField(0) @Default(7) int chunkSize,
    @HiveField(1) @Default(2) int chunkOverlap,

    // Hifz order
    @HiveField(2) @Default('forward') String hifzOrder,  // forward|reverse|nuzulForward|nuzulReverse|custom

    // Display
    @HiveField(3) @Default('en') String interfaceLanguage,
    @HiveField(4) @Default('en') String translationLanguage,
    @HiveField(5) @Default(true) bool showArabic,
    @HiveField(6) @Default(true) bool showTransliteration,
    @HiveField(7) @Default(true) bool showTranslation,
    @HiveField(8) @Default(true) bool showTafsir,
    @HiveField(9) @Default(28) int arabicFontSize,
    @HiveField(10) @Default('AmiriQuran') String arabicFont,

    // Playback defaults
    @HiveField(11) @Default(1.0) double defaultSpeed,
    @HiveField(12) @Default(3) int defaultVerseRepetition,
    @HiveField(13) @Default(1) int defaultChunkRepetition,  // 0 = infinite
    @HiveField(14) @Default(1.0) double interVerseGap,       // seconds
    @HiveField(15) @Default('none') String defaultAmbience,
    @HiveField(16) @Default(60) int ambienceVolume,           // 0-100
    @HiveField(17) @Default(true) bool autoAdvanceChunk,

    // Recording
    @HiveField(18) @Default('high') String audioQuality,      // low|high|lossless
    @HiveField(19) @Default(true) bool autoSilenceDetection,
    @HiveField(20) @Default('bars') String waveformStyle,

    // Appearance
    @HiveField(21) @Default('system') String theme,            // light|dark|system
    @HiveField(22) @Default(true) bool islamicPatterns,
    @HiveField(23) @Default('gold') String accentColor,

    // Meta
    @HiveField(24) @Default(false) bool onboardingComplete,
  }) = _UserSettings;

  factory UserSettings.fromJson(Map<String, dynamic> json) => _$UserSettingsFromJson(json);
}
```

### 2.7 Bookmark (Hive-persisted)

```dart
@freezed
@HiveType(typeId: 4)
class Bookmark with _$Bookmark {
  const factory Bookmark({
    @HiveField(0) required String id,
    @HiveField(1) required int surahNumber,
    @HiveField(2) required int verseNumber,
    @HiveField(3) required DateTime createdAt,
    @HiveField(4) String? note,
  }) = _Bookmark;

  factory Bookmark.fromJson(Map<String, dynamic> json) => _$BookmarkFromJson(json);
}
```

### 2.8 ActivityLog (Hive-persisted)

```dart
@freezed
@HiveType(typeId: 5)
class ActivityLog with _$ActivityLog {
  const factory ActivityLog({
    @HiveField(0) required String id,
    @HiveField(1) required String type,          // playback | recording | milestone
    @HiveField(2) required DateTime timestamp,
    @HiveField(3) required String chunkId,
    @HiveField(4) String? recordingId,
    @HiveField(5) @Default(0) int durationMs,
    @HiveField(6) @Default('') String description,
  }) = _ActivityLog;

  factory ActivityLog.fromJson(Map<String, dynamic> json) => _$ActivityLogFromJson(json);
}
```

### 2.9 PlaybackState (runtime only, not persisted)

```dart
enum PlaybackStatus { idle, loading, playing, paused }

@freezed
class PlaybackState with _$PlaybackState {
  const factory PlaybackState({
    @Default(PlaybackStatus.idle) PlaybackStatus status,
    @Default(0) int currentVerseIndex,
    @Default(0) int verseRepCount,
    @Default(0) int chunkRepCount,
    @Default(Duration.zero) Duration elapsed,
    @Default(Duration.zero) Duration total,
    @Default(1.0) double speed,
    @Default('none') String ambience,
    @Default(60) int ambienceVolume,
    @Default(3) int verseRepMax,
    @Default(1) int chunkRepMax,       // 0 = infinite
    @Default(false) bool shuffle,
    String? activeRecordingId,
    String? activeChunkId,
  }) = _PlaybackState;
}
```

---

## 3. REPOSITORY INTERFACES

### QuranRepository

```
getAll() → List<Surah>
getSurah(int number) → Surah
getVersesForChunk(int surahNumber, int startVerse, int endVerse) → List<Verse>
searchSurahs(String query) → List<Surah>
```

### ChunkRepository

```
getChunksForSurah(int surahNumber) → List<Chunk>
getChunk(String id) → Chunk?
saveChunk(Chunk chunk) → void
saveChunks(List<Chunk> chunks) → void
updateStatus(String id, String status) → void
updateLastAccessed(String id) → void
deleteChunksForSurah(int surahNumber) → void
getLastActiveChunkId() → String?
setLastActiveChunkId(String id) → void
```

### RecordingRepository

```
getRecordingsForChunk(String chunkId) → List<Recording>
getAllRecordings() → List<Recording>
getRecording(String id) → Recording?
save(Recording recording) → void
rename(String id, String newName) → void
delete(String id) → void           // also deletes .m4a files from disk
getRecordingCountForSurah(int surahNumber) → int
getTotalDurationForSurah(int surahNumber) → int   // ms
```

### SettingsRepository

```
get() → UserSettings
save(UserSettings settings) → void
update(UserSettings Function(UserSettings) updater) → void
reset() → void
```

### BookmarkRepository

```
getAll() → List<Bookmark>
add(Bookmark bookmark) → void
remove(String id) → void
isBookmarked(int surahNumber, int verseNumber) → bool
toggle(int surahNumber, int verseNumber) → void
```

### ActivityRepository

```
log(ActivityLog entry) → void
getAll() → List<ActivityLog>
getForDateRange(DateTime start, DateTime end) → List<ActivityLog>
getStreak() → int
getBestStreak() → int
getTotalListeningMs() → int
getVelocity() → double          // verses per active day
getActiveDays() → int
```

---

## 4. CHUNK GENERATION ALGORITHM

```
function generateChunks(surahNumber, totalVerses, chunkSize, overlap):
    chunks = []
    currentStart = 1
    chunkIndex = 0

    while currentStart <= totalVerses:
        if chunkIndex == 0:
            start = 1                              // first chunk: no overlap
        else:
            start = currentStart - overlap         // subsequent: overlap N verses

        end = min(currentStart + chunkSize - 1, totalVerses)

        chunks.add(Chunk(
            id: "{surahNumber}-chunk-{chunkIndex}",
            surahNumber: surahNumber,
            startVerse: start,
            endVerse: end,
            chunkIndex: chunkIndex,
            status: "notStarted",
            totalChunksInSurah: 0,   // backfilled after loop
        ))

        currentStart = end + 1
        chunkIndex++

    // Backfill total
    for chunk in chunks:
        chunk = chunk.copyWith(totalChunksInSurah: chunks.length)

    return chunks
```

**Example**: Al-Baqarah (286 verses), chunkSize=7, overlap=2:

```
Chunk 0:  verses  1–7    (7 verses)
Chunk 1:  verses  6–12   (7 verses, overlap 2)
Chunk 2:  verses 11–17
Chunk 3:  verses 16–22
...
Chunk 40: verses 281–286 (remaining)
Total: 41 chunks
```

---

## 5. RIVERPOD PROVIDERS

```dart
// Quran data (loaded once on app start)
final quranProvider = FutureProvider<List<Surah>>((ref) async {
  return ref.read(quranRepositoryProvider).getAll();
});

// Current surah (derived from current chunk)
final currentSurahProvider = Provider<Surah?>((ref) {
  final chunk = ref.watch(currentChunkProvider);
  final surahs = ref.watch(quranProvider).valueOrNull;
  if (chunk == null || surahs == null) return null;
  return surahs.firstWhere((s) => s.number == chunk.surahNumber);
});

// Current chunk (set by navigation / chunk arrows)
final currentChunkProvider = StateProvider<Chunk?>((ref) => null);

// All chunks for current surah
final allChunksForSurahProvider = Provider<List<Chunk>>((ref) {
  final chunk = ref.watch(currentChunkProvider);
  if (chunk == null) return [];
  return ref.read(chunkRepositoryProvider).getChunksForSurah(chunk.surahNumber);
});

// Verses for current chunk
final versesForChunkProvider = Provider<List<Verse>>((ref) {
  final chunk = ref.watch(currentChunkProvider);
  final surah = ref.watch(currentSurahProvider);
  if (chunk == null || surah == null) return [];
  return surah.verses.where((v) => v.number >= chunk.startVerse && v.number <= chunk.endVerse).toList();
});

// Recordings for current chunk
final recordingsProvider = Provider<List<Recording>>((ref) {
  final chunk = ref.watch(currentChunkProvider);
  if (chunk == null) return [];
  return ref.read(recordingRepositoryProvider).getRecordingsForChunk(chunk.id);
});

// Selected recording
final selectedRecordingProvider = StateProvider<Recording?>((ref) => null);

// Settings
final settingsProvider = StateNotifierProvider<SettingsNotifier, UserSettings>((ref) {
  return SettingsNotifier(ref.read(settingsRepositoryProvider));
});

// Playback state
final playbackStateProvider = StateNotifierProvider<PlaybackStateNotifier, PlaybackState>((ref) {
  return PlaybackStateNotifier();
});

// Last active chunk ID (persisted in Hive meta box)
final lastActiveChunkIdProvider = StateProvider<String?>((ref) {
  return ref.read(chunkRepositoryProvider).getLastActiveChunkId();
});
```
