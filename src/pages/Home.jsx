import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { localChunkIndex, localEntities } from "../components/localData";
import { resolveAudioUrl } from "../components/fileStorage";
import { fetchSurahVersesForLanguage, generateChunks, prefetchAllQuranData } from "../components/quranData";
import { useSettings } from "../components/useSettings";
import ChunkHeader from "../components/home/ChunkHeader";
import { useThemeColors } from "../components/useThemeColors";
import SurahSelector from "../components/home/SurahSelector";
import LuxuryControlBar from "../components/home/LuxuryControlBar";
import LuxuryVerseStack from "../components/home/LuxuryVerseStack";
import FullChunkView from "../components/home/FullChunkView";
import PlaybackStatusBar from "../components/home/PlaybackStatusBar";
import OptionsSheet from "../components/home/OptionsSheet";
import { Expand } from "lucide-react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings, updateSettings, loading: settingsLoading } = useSettings();

  // Data
  const [surah, setSurah] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [recordings, setRecordings] = useState([]);
  const [selectedRecordingId, setSelectedRecordingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Playback
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [playbackState, setPlaybackState] = useState("idle"); // idle|playing|paused
  const [verseRepCount, setVerseRepCount] = useState(1);
  const [chunkRepCount, setChunkRepCount] = useState(1);

  // Options
  const [speed, setSpeed] = useState(1.0);
  const [verseRepetition, setVerseRepetition] = useState(3);
  const [chunkRepetition, setChunkRepetition] = useState(1);
  const [interVerseGap, setInterVerseGap] = useState(1.0);
  const [shuffleVerses, setShuffleVerses] = useState(false);
  const [autoAdvanceChunk, setAutoAdvanceChunk] = useState(true);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [showRecitePrompt, setShowRecitePrompt] = useState(false);
  const [fullChunkMode, setFullChunkMode] = useState(false);

  // Refs for playback engine
  const playbackRef = useRef({ stop: false, pause: false, skipToVerse: null });
  const audioRef = useRef(null);
  const pauseResolverRef = useRef(null);
  const skipResolverRef = useRef(null);
  const gapTimerRef = useRef(null);
  const gapResolverRef = useRef(null);
  const speedRef = useRef(speed);
  const chunksRef = useRef(chunks);
  const currentChunkIndexRef = useRef(currentChunkIndex);
  const verseRefs = useRef([]);
  const scrollRef = useRef(null);

  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { chunksRef.current = chunks; }, [chunks]);
  useEffect(() => { currentChunkIndexRef.current = currentChunkIndex; }, [currentChunkIndex]);

  function normalizeChunkRecord(chunk, surahNumber) {
    return {
      ...chunk,
      surah_number: surahNumber,
      status: chunk.status || "not_started",
      listen_count: chunk.listen_count || 0,
      recitation_attempts: chunk.recitation_attempts || 0,
      recite_prompt_dismissed: chunk.recite_prompt_dismissed || false,
    };
  }

  async function getIndexedChunksForSurah(surahNumber) {
    const storedIndex = await localChunkIndex.get();
    const indexSurahs = storedIndex?.surahs || {};
    const raw = indexSurahs[String(surahNumber)] || indexSurahs[surahNumber];
    if (!raw || storedIndex.chunk_size !== (settings.chunk_size || 7) || storedIndex.chunk_overlap !== (settings.chunk_overlap || 2)) {
      return null;
    }

    return raw.map(([chunk_index, start_verse, end_verse]) => ({
      chunk_index,
      start_verse,
      end_verse,
      surah_number: surahNumber,
      status: "not_started",
      listen_count: 0,
      recitation_attempts: 0,
      recite_prompt_dismissed: false,
      id: `idx_${surahNumber}_${chunk_index}`,
    }));
  }

  async function getChunksForSurah(surahData, surahNum) {
    const chunkSize = settings.chunk_size || 7;
    const chunkOverlap = settings.chunk_overlap || 2;

    let existing = (await localEntities.Chunk.filter({ surah_number: surahNum }, "chunk_index")).map((chunk) =>
      normalizeChunkRecord(chunk, surahNum)
    );

    const expected = generateChunks(surahData.total_verses, chunkSize, chunkOverlap);
    const matchesExpected =
      existing.length === expected.length &&
      existing.every((chunk, index) =>
        chunk.chunk_index === expected[index].chunk_index &&
        chunk.start_verse === expected[index].start_verse &&
        chunk.end_verse === expected[index].end_verse
      );

    if (matchesExpected) return existing;

    const indexed = await getIndexedChunksForSurah(surahNum);
    if (indexed?.length) return indexed;

    return expected.map((chunk) => ({
      ...chunk,
      surah_number: surahNum,
      status: "not_started",
      listen_count: 0,
      recitation_attempts: 0,
      recite_prompt_dismissed: false,
      id: `runtime_${surahNum}_${chunk.chunk_index}`,
    }));
  }

  // Initial load
  useEffect(() => {
    if (!settingsLoading) {
      setSpeed(settings.default_speed ?? 1.0);
      setVerseRepetition(settings.default_verse_repetition ?? 1);
      setChunkRepetition(settings.default_chunk_repetition ?? 0);
      loadInitialData();

      // Warm up local cache with major riwayat and current translation language (non-blocking)
      const prefetchRiwayat = ["warsh", "hafs", "qalun", "al_duri"];
      const transliterationLanguages = settings.offline_download_transliteration
        ? [settings.transliteration_language || "en"]
        : ["en"];
      const transliterationSources = settings.offline_download_transliteration
        ? [settings.transliteration_source || "standard"]
        : ["standard"];
      const prefetchKey = `hifz_prefetched_full_${settings.display_language || "en"}_${prefetchRiwayat.join("_")}`;
      if (!localStorage.getItem(prefetchKey)) {
        prefetchAllQuranData(
          [settings.display_language || "en"],
          prefetchRiwayat,
          transliterationLanguages,
          transliterationSources
        )
          .then(() => {
            localStorage.setItem(prefetchKey, "1");
          })
          .catch(() => {
            // Best effort; keep app responsive even if prefetch fails.
          });
      }
    }
  }, [settingsLoading, settings.display_language, settings.quran_riwaya]);

  // Refresh recordings when returning from Record page
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const chunkParam = urlParams.get("chunk");
    if (chunkParam) {
      localEntities.Recording.filter({ chunk_id: chunkParam }).then(recs => {
        setRecordings(recs);
        if (recs.length > 0) setSelectedRecordingId(recs[0].id);
      });
    }
  }, [location.search]);

  // Auto-scroll to current verse
  useEffect(() => {
    verseRefs.current[currentVerseIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentVerseIndex]);

  async function loadInitialData() {
    setLoading(true);
    const surahNum = settings.last_surah_number || 1;
    const surahData = await fetchSurahVersesForLanguage(
      surahNum,
      settings.display_language || "en",
      settings.quran_riwaya || "warsh"
      ,settings.transliteration_language || "en"
      ,settings.transliteration_source || "standard"
    );
    setSurah(surahData);

    const existing = await getChunksForSurah(surahData, surahNum);

    setChunks(existing);
    setCurrentChunkIndex(0);
    await loadRecordings(existing[0]?.id);
    setLoading(false);
  }

  async function loadRecordings(chunkId, keepSelected = false) {
    if (!chunkId) return;
    const recs = await localEntities.Recording.filter({ chunk_id: chunkId });
    setRecordings(recs);
    if (recs.length > 0) {
      if (!keepSelected || !recs.find(r => r.id === selectedRecordingId)) {
        setSelectedRecordingId(recs[0].id);
      }
    } else {
      setSelectedRecordingId(null);
    }
  }

  async function incrementListenCountForCurrentChunk() {
    if (!currentChunk) return;
    const listenCount = (currentChunk.listen_count || 0) + 1;
    const recitePromptThreshold = settings.recite_prompt_threshold || 10;
    const shouldPrompt =
      listenCount >= recitePromptThreshold &&
      !(currentChunk.recite_prompt_dismissed ?? false) &&
      currentChunk.status !== "completed";

    await localEntities.Chunk.update(currentChunk.id, { listen_count: listenCount });
    setChunks((prev) =>
      prev.map((c) => (c.id === currentChunk.id ? { ...c, listen_count: listenCount } : c))
    );
    if (shouldPrompt) setShowRecitePrompt(true);
  }

  async function goToChunk(index) {
    if (index < 0 || index >= chunks.length) return;
    stopPlayback();
    setCurrentChunkIndex(index);
    setCurrentVerseIndex(0);
    const chunk = chunks[index];
    updateSettings({ last_chunk_id: chunk.id });
    await loadRecordings(chunk.id);
    localEntities.Chunk.update(chunk.id, {
      last_accessed: new Date().toISOString(),
      status: chunk.status === "not_started" ? "in_progress" : chunk.status,
    });
  }

  async function loadSurah(surahNum) {
    stopPlayback();
    setLoading(true);
    const surahData = await fetchSurahVersesForLanguage(
      surahNum,
      settings.display_language || "en",
      settings.quran_riwaya || "warsh"
      ,settings.transliteration_language || "en"
      ,settings.transliteration_source || "standard"
    );
    setSurah(surahData);

    const existing = await getChunksForSurah(surahData, surahNum);

    setChunks(existing);
    setCurrentChunkIndex(0);
    setCurrentVerseIndex(0);
    updateSettings({ last_surah_number: surahNum, last_chunk_id: existing[0]?.id });
    await loadRecordings(existing[0]?.id);
    setLoading(false);
  }

  // ── Playback Engine ──────────────────────────────────────────────

  function playAudio(fileRef) {
    return new Promise(async (resolve) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      const url = await resolveAudioUrl(fileRef);
      if (!url) { resolve(); return; }
      const audio = new Audio(url);
      audio.playbackRate = speedRef.current;
      audioRef.current = audio;
      skipResolverRef.current = resolve;
      const finish = () => { skipResolverRef.current = null; resolve(); };
      audio.onended = finish;
      audio.onerror = finish;
      audio.play().catch(finish);
    });
  }

  function gap(ms) {
    return new Promise(resolve => {
      gapResolverRef.current = resolve;
      gapTimerRef.current = setTimeout(() => { gapResolverRef.current = null; resolve(); }, ms);
    });
  }

  function cancelGap() {
    clearTimeout(gapTimerRef.current);
    gapResolverRef.current?.();
    gapResolverRef.current = null;
  }

  async function waitIfPaused() {
    while (playbackRef.current.pause && !playbackRef.current.stop) {
      await new Promise(r => { pauseResolverRef.current = r; });
    }
  }

  const startPlayback = useCallback(async () => {
    const recording = recordings.find(r => r.id === selectedRecordingId);
    if (!recording?.verse_files?.length) return;

    incrementListenCountForCurrentChunk();

    playbackRef.current = { stop: false, pause: false, skipToVerse: null };
    setPlaybackState("playing");
    setVerseRepCount(1);
    setChunkRepCount(1);

    let chunkRep = 0;

    outer: while (!playbackRef.current.stop) {
      if (chunkRepetition !== 0 && chunkRep >= chunkRepetition) {
        if (autoAdvanceChunk) {
          const nextIdx = currentChunkIndexRef.current + 1;
          if (nextIdx < chunksRef.current.length) {
            setCurrentChunkIndex(nextIdx);
            currentChunkIndexRef.current = nextIdx;
            setCurrentVerseIndex(0);
            chunkRep = 0;
            // Continue with same recording since we don't reload
          } else {
            break;
          }
        } else {
          break;
        }
      }

      let verseFiles = [...recording.verse_files];
      if (shuffleVerses) verseFiles.sort(() => Math.random() - 0.5);

      for (let i = 0; i < verseFiles.length; i++) {
        if (playbackRef.current.stop) break outer;

        if (playbackRef.current.skipToVerse !== null) {
          i = playbackRef.current.skipToVerse;
          playbackRef.current.skipToVerse = null;
        }

        setCurrentVerseIndex(i);

        for (let v = 0; v < verseRepetition; v++) {
          if (playbackRef.current.stop) break outer;

          if (playbackRef.current.skipToVerse !== null) {
            i = playbackRef.current.skipToVerse - 1;
            playbackRef.current.skipToVerse = null;
            break;
          }

          setVerseRepCount(v + 1);
          setChunkRepCount(chunkRep + 1);

          await waitIfPaused();
          if (playbackRef.current.stop) break outer;

          await playAudio(verseFiles[i].file_url);
          if (playbackRef.current.stop) break outer;

          if (v < verseRepetition - 1) {
            await gap(interVerseGap * 1000);
          }
        }

        if (i < verseFiles.length - 1 && !playbackRef.current.stop) {
          await gap(interVerseGap * 1000);
        }
      }

      chunkRep++;
    }

    setPlaybackState("idle");
    setCurrentVerseIndex(0);
    setVerseRepCount(1);
    setChunkRepCount(1);
  }, [recordings, selectedRecordingId, verseRepetition, chunkRepetition, interVerseGap, shuffleVerses, autoAdvanceChunk]);

  function handlePause() {
    playbackRef.current.pause = true;
    setPlaybackState("paused");
    audioRef.current?.pause();
  }

  function handleResume() {
    playbackRef.current.pause = false;
    setPlaybackState("playing");
    audioRef.current?.play().catch(() => {});
    pauseResolverRef.current?.();
    pauseResolverRef.current = null;
  }

  function stopPlayback() {
    playbackRef.current.stop = true;
    playbackRef.current.pause = false;
    cancelGap();
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; audioRef.current = null; }
    skipResolverRef.current?.(); skipResolverRef.current = null;
    pauseResolverRef.current?.(); pauseResolverRef.current = null;
    setPlaybackState("idle");
    setCurrentVerseIndex(0);
    setVerseRepCount(1);
    setChunkRepCount(1);
  }

  function skipToPrevVerse() {
    const newIdx = Math.max(0, currentVerseIndex - 1);
    playbackRef.current.skipToVerse = newIdx;
    cancelGap();
    audioRef.current?.pause();
    skipResolverRef.current?.(); skipResolverRef.current = null;
  }

  function skipToNextVerse() {
    const verses = chunkVerses;
    const newIdx = Math.min(verses.length - 1, currentVerseIndex + 1);
    playbackRef.current.skipToVerse = newIdx;
    cancelGap();
    audioRef.current?.pause();
    skipResolverRef.current?.(); skipResolverRef.current = null;
  }

  function handleRecord() {
    if (playbackState !== "idle") stopPlayback();
    if (currentChunk) navigate(`/app/Record?chunkId=${currentChunk.id}`);
  }

  function handleRecite() {
    if (!currentChunk) return;
    navigate(`/app/recite/${currentChunk.id}`);
  }

  async function dismissRecitePrompt() {
    if (!currentChunk) return;
    setShowRecitePrompt(false);
    await localEntities.Chunk.update(currentChunk.id, { recite_prompt_dismissed: true });
    setChunks((prev) =>
      prev.map((c) => (c.id === currentChunk.id ? { ...c, recite_prompt_dismissed: true } : c))
    );
  }

  // ── Derived data ─────────────────────────────────────────────────

  const currentChunk = chunks[currentChunkIndex];
  const chunkVerses = surah && currentChunk
    ? surah.verses.filter(v => v.number >= currentChunk.start_verse && v.number <= currentChunk.end_verse)
    : [];

  const selectedRecording = recordings.find(r => r.id === selectedRecordingId);
  const fmtMs = ms => {
    if (!ms) return "";
    const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const t = useThemeColors();
  const isActive = playbackState === "playing" || playbackState === "paused";
  const canRecite = recordings.length > 0 && !!selectedRecordingId;
  const reciteLabel = currentChunk?.status === "completed" ? "Re-test" : "Recite";

  if (loading || settingsLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D5C46] mx-auto" />
          <p className="text-sm text-muted-foreground font-inter mt-3">Loading Quran data...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif", background: t.pageBg, backgroundImage: t.pageBgPattern, backgroundSize: "48px 48px" }}
    >
      {/* Zone 1 — Luxury Header */}
      <ChunkHeader
        surahNameArabic={surah?.name_arabic}
        surahNameEnglish={surah?.name_english}
        startVerse={currentChunk?.start_verse}
        endVerse={currentChunk?.end_verse}
        currentChunkIndex={currentChunkIndex}
        totalChunks={chunks.length}
        onPrev={() => goToChunk(currentChunkIndex - 1)}
        onNext={() => goToChunk(currentChunkIndex + 1)}
      />

      {/* Zone 2 — Luxury Surah Pill */}
      <div className="pt-2.5">
        <SurahSelector currentSurah={surah} onSelectSurah={loadSurah} />
      </div>

      <div className="px-4 pt-2 flex justify-end">
        <button
          onClick={() => setFullChunkMode((prev) => !prev)}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
          style={{
            background: fullChunkMode ? "linear-gradient(160deg, #D4AF37 0%, #B98218 100%)" : "rgba(212,175,55,0.12)",
            border: `1px solid ${fullChunkMode ? "#8E6415" : "rgba(212,175,55,0.28)"}`,
            boxShadow: fullChunkMode ? "0 4px 18px rgba(183,130,24,0.35)" : "0 2px 10px rgba(0,0,0,0.12)",
          }}
          title={fullChunkMode ? "Switch to ayat mode" : "Switch to full chunk mode"}
        >
          <Expand className="w-4.5 h-4.5" style={{ color: fullChunkMode ? "#2B241B" : "#D4AF37" }} />
        </button>
      </div>

      {/* Zone 3 — Luxury Verse Stack */}
      {showRecitePrompt && (
        <div className="mx-4 mt-2 rounded-2xl border border-[#D4AF3766] bg-[#0E5B3D] p-3 text-[#F2D675]">
          <p className="text-sm font-semibold">💡 You've listened to this chunk {(currentChunk?.listen_count || 0)} times!</p>
          <p className="text-xs text-[#E9D8A6] mt-1">Ready to test your memorization?</p>
          <div className="mt-2 flex gap-2">
            <button onClick={handleRecite} className="h-9 px-3 rounded-lg bg-[#D4AF37] text-[#2B241B] text-sm font-semibold">🧠 Test Myself</button>
            <button onClick={dismissRecitePrompt} className="h-9 px-3 rounded-lg border border-[#D4AF37] text-[#F2D675] text-sm">Later</button>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentChunkIndex}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -32 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex-1 overflow-hidden"
        >
          {fullChunkMode ? (
            <FullChunkView
              verses={chunkVerses}
              language={settings.display_language || "en"}
            />
          ) : (
            <LuxuryVerseStack
              verses={chunkVerses}
              currentVerseIndex={currentVerseIndex}
              onVerseChange={setCurrentVerseIndex}
              isPlaying={isActive}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Gold ornamental divider */}
      <div className="px-8 py-1">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #D4AF37)" }} />
          <span style={{ color: "#D4AF37", fontSize: "9px" }}>✦</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, #D4AF37)" }} />
        </div>
      </div>

      {/* Zone 4 — Playback Status Bar */}
      <PlaybackStatusBar
        visible={isActive}
        isPlaying={playbackState === "playing"}
        speed={speed}
        verseRep={verseRepCount}
        verseRepTotal={verseRepetition}
        chunkRep={chunkRepCount}
        chunkRepTotal={chunkRepetition}
        onPrevVerse={skipToPrevVerse}
        onNextVerse={skipToNextVerse}
        canPrevVerse={currentVerseIndex > 0}
        canNextVerse={currentVerseIndex < chunkVerses.length - 1}
      />

      {/* Zone 5 — Luxury Control Bar */}
      <LuxuryControlBar
        playbackState={playbackState}
        hasRecording={recordings.length > 0 && !!selectedRecordingId}
        selectedRecordingName={selectedRecording?.name}
        selectedRecordingDuration={selectedRecording ? fmtMs(selectedRecording.total_duration_ms) : null}
        canRecite={canRecite}
        reciteLabel={reciteLabel}
        onRecord={handleRecord}
        onRecite={handleRecite}
        onPlay={startPlayback}
        onPause={handlePause}
        onResume={handleResume}
        onStop={stopPlayback}
        onMenu={() => setOptionsOpen(true)}
      />

      {/* Options Sheet */}
      <OptionsSheet
        open={optionsOpen}
        onClose={() => setOptionsOpen(false)}
        recordings={recordings}
        selectedRecordingId={selectedRecordingId}
        onSelectRecording={setSelectedRecordingId}
        speed={speed}
        onSpeedChange={setSpeed}
        verseRepetition={verseRepetition}
        onVerseRepetitionChange={setVerseRepetition}
        chunkRepetition={chunkRepetition}
        onChunkRepetitionChange={setChunkRepetition}
        interVerseGap={interVerseGap}
        onInterVerseGapChange={setInterVerseGap}
        shuffleVerses={shuffleVerses}
        onShuffleVersesChange={setShuffleVerses}
        autoAdvanceChunk={autoAdvanceChunk}
        onAutoAdvanceChunkChange={setAutoAdvanceChunk}
      />
    </div>
  );
}