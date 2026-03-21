import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { localChunkIndex, localEntities } from "../components/localData";
import { storeAudioBlob } from "../components/fileStorage";
import { fetchSurahList, fetchSurahVersesForLanguage, generateChunks } from "../components/quranData";
import { useSettings } from "../components/useSettings";
import { X, RotateCcw, Play, Square, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import WaveformVisualizer from "../components/record/WaveformVisualizer";
import VerseProgressTrack from "../components/record/VerseProgressTrack";

const arabesque = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cpath d='M24 3 L26 22 L45 24 L26 26 L24 45 L22 26 L3 24 L22 22 Z' fill='%23D4AF37' fill-opacity='0.055'/%3E%3C/svg%3E")`;

// ── Sub-components ──────────────────────────────────────────────────────────

function RecordTimerPill({ sessionElapsed, isRecording }) {
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full relative overflow-hidden flex-shrink-0"
      style={{
        background: "linear-gradient(160deg, #C44A1A 0%, #A92E16 55%, #7E1C10 100%)",
        border: "1.5px solid #D4AF37",
        boxShadow: "0 2px 10px rgba(169,46,22,0.55), inset 0 1px 1px rgba(255,255,255,0.12)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none rounded-t-full"
        style={{ height: "42%", background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)" }}
      />
      <motion.div
        animate={isRecording ? { opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] } : { opacity: 0.4 }}
        transition={{ repeat: Infinity, duration: 1.1 }}
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: "#FF4A2A", boxShadow: "0 0 6px #FF4A2A" }}
      />
      <span
        className="font-mono font-semibold"
        style={{ fontSize: "12px", color: "#F8EDD0", letterSpacing: "0.06em" }}
      >
        {fmt(sessionElapsed)}
      </span>
    </div>
  );
}

function GoldSeparator() {
  return (
    <div className="flex items-center justify-center gap-1.5 my-2">
      <div style={{ height: "1.5px", width: "52px", background: "linear-gradient(to right, transparent, #D4AF37)" }} />
      <span style={{ color: "#F2D675", fontSize: "8px" }}>✦</span>
      <div style={{ height: "1.5px", width: "52px", background: "linear-gradient(to left, transparent, #D4AF37)" }} />
    </div>
  );
}

function VerseCard({ verse, isLast }) {
  if (!verse) return null;
  return (
    // Outer gold frame
    <div
      className="mx-4 relative"
      style={{
        filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.45)) drop-shadow(0 0 18px rgba(212,175,55,0.18))",
      }}
    >
      <div
        className="w-full rounded-3xl p-[2.5px] relative"
        style={{
          background: "linear-gradient(145deg, #F2D675 0%, #D4AF37 30%, #8E6820 60%, #D4AF37 100%)",
          boxShadow: "0 0 0 1px rgba(242,214,117,0.28)",
        }}
      >
        {/* Parchment body */}
        <div
          className="w-full rounded-[22px] overflow-hidden flex flex-col px-5 pt-5 pb-4 relative"
          style={{
            background: "linear-gradient(160deg, #FFF9F0 0%, #F8F3E8 35%, #F1E8D5 100%)",
            minHeight: "0",
          }}
        >
          {/* Arabesque overlay inside parchment */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: arabesque, backgroundSize: "48px 48px", opacity: 0.4 }}
          />
          {/* Inner top highlight */}
          <div
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{
              height: "35%",
              background: "linear-gradient(180deg, rgba(255,249,240,0.65) 0%, transparent 100%)",
              borderRadius: "22px 22px 0 0",
            }}
          />

          {/* Corner ornaments */}
          {["top-2 left-3", "top-2 right-3", "bottom-2 left-3", "bottom-2 right-3"].map((pos) => (
            <span key={pos} className={`absolute ${pos} select-none pointer-events-none`}
              style={{ color: "#D4AF37", fontSize: "10px", opacity: 0.45 }}>◆</span>
          ))}

          {/* Gold verse medallion */}
          <div className="flex justify-center mb-3 relative z-10">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #F4D97B 0%, #C9971E 55%, #8B641B 100%)",
                boxShadow: "0 3px 10px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.28)",
                border: "1px solid #8B641B",
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 pointer-events-none rounded-t-full"
                style={{ height: "45%", background: "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)" }}
              />
              <span className="font-bold font-inter relative z-10" style={{ fontSize: "13px", color: "#FFF9F0" }}>
                {verse.number}
              </span>
            </div>
          </div>

          {/* Arabic text */}
          <div className="relative z-10">
            <p
              dir="rtl"
              className="font-amiri text-center leading-[2.05]"
              style={{ fontSize: "26px", color: "#213226" }}
            >
              {verse.arabic}
            </p>

            <GoldSeparator />

            {/* Translation */}
            <p
              className="font-inter text-center leading-relaxed"
              style={{ fontSize: "12px", color: "#6B6253", lineHeight: 1.65 }}
            >
              {verse.translation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimaryGoldButton({ onClick, disabled, isLast, isProcessing }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      disabled={disabled}
      className="mx-4 w-[calc(100%-2rem)] relative overflow-hidden rounded-2xl disabled:opacity-50"
      style={{
        height: "52px",
        background: isLast
          ? "linear-gradient(160deg, #2B8A3E 0%, #1E7A34 50%, #136228 100%)"
          : "linear-gradient(160deg, #F3D671 0%, #D4AF37 40%, #B98218 75%, #8E6415 100%)",
        border: isLast ? "1.5px solid #D4AF37" : "1.5px solid #8E6415",
        boxShadow: isLast
          ? "0 4px 20px rgba(30,122,52,0.45), inset 0 1px 1px rgba(255,255,255,0.1)"
          : "0 4px 20px rgba(183,130,24,0.5), inset 0 1px 1.5px rgba(255,255,255,0.22)",
      }}
    >
      {/* Top shine */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "44%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)",
          borderRadius: "14px 14px 0 0",
        }}
      />
      <div className="relative flex items-center justify-center gap-2.5">
        <span
          className="font-inter font-bold tracking-widest"
          style={{ fontSize: "15px", color: isLast ? "#FFFFFF" : "#2B241B", letterSpacing: "0.12em" }}
        >
          {isProcessing ? "SAVING..." : isLast ? "FINISH" : "NEXT"}
        </span>
        {!isProcessing && (
          <span style={{ color: isLast ? "#FFFFFF" : "#2B241B", fontSize: "14px" }}>
            {isLast ? "✓" : "›"}
          </span>
        )}
        {isProcessing && <Loader2 className="w-4 h-4 animate-spin" style={{ color: isLast ? "#FFF" : "#2B241B" }} />}
      </div>
    </motion.button>
  );
}

function SecondaryButton({ onClick, disabled, icon, label, variant }) {
  const isGreen = variant === "green";
  const isPreviewActive = variant === "preview-active";

  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      disabled={disabled}
      className="relative overflow-hidden rounded-xl flex items-center gap-2 px-5 py-2.5 disabled:opacity-40"
      style={{
        background: isGreen
          ? "linear-gradient(160deg, #136B47 0%, #0E5B3D 55%, #0A412B 100%)"
          : isPreviewActive
          ? "linear-gradient(160deg, #0E5B3D 0%, #0A412B 100%)"
          : "linear-gradient(160deg, #FFF9F0 0%, #EDE1C9 100%)",
        border: "1.5px solid #D4AF37",
        boxShadow: isGreen || isPreviewActive
          ? "0 3px 12px rgba(10,65,43,0.45), inset 0 1px 1px rgba(255,255,255,0.1)"
          : "0 3px 12px rgba(183,130,24,0.22), inset 0 1px 1px rgba(255,255,255,0.6)",
        minWidth: "110px",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "42%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 100%)",
          borderRadius: "10px 10px 0 0",
        }}
      />
      <span className="relative z-10" style={{ color: isGreen || isPreviewActive ? "#D4AF37" : "#0F6B45" }}>
        {icon}
      </span>
      <span
        className="relative z-10 font-inter font-semibold"
        style={{
          fontSize: "13px",
          color: isGreen || isPreviewActive ? "#F0E6C8" : "#24422F",
        }}
      >
        {label}
      </span>
    </motion.button>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function Record() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const chunkId = params.get("chunkId");
  const { settings } = useSettings();

  const [chunk, setChunk] = useState(null);
  const [surah, setSurah] = useState(null);
  const [verses, setVerses] = useState([]);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [sessionElapsed, setSessionElapsed] = useState(0);
  const [verseElapsed, setVerseElapsed] = useState(0);
  const [recordedFiles, setRecordedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [recordingName, setRecordingName] = useState("");
  const [saving, setSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [helperText, setHelperText] = useState("Recite, then tap Next");
  const [mediaStream, setMediaStream] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const sessionTimerRef = useRef(null);
  const verseTimerRef = useRef(null);
  const previewAudioRef = useRef(null);
  const currentBlobUrlRef = useRef(null);
  const verseBlobs = useRef({});

  useEffect(() => {
    loadChunkData();
    return () => {
      stopAllTimers();
      stopStream();
      previewAudioRef.current?.pause();
      if (currentBlobUrlRef.current) URL.revokeObjectURL(currentBlobUrlRef.current);
    };
  }, []);

  function stopAllTimers() {
    clearInterval(sessionTimerRef.current);
    clearInterval(verseTimerRef.current);
  }

  function stopStream() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setMediaStream(null);
  }

  async function loadChunkData() {
    if (!chunkId) { navigate("/Home"); return; }
    let c = null;

    const chunks = await localEntities.Chunk.filter({ id: chunkId });
    if (chunks.length) {
      c = chunks[0];
    } else {
      const match = /^((idx|runtime)_(\d+)_(\d+))$/.exec(chunkId);
      if (match) {
        const surahNumber = parseInt(match[3], 10);
        const chunkIndex = parseInt(match[4], 10);
        const storedIndex = await localChunkIndex.get();
        const raw = storedIndex?.surahs?.[String(surahNumber)] || storedIndex?.surahs?.[surahNumber];

        if (raw && storedIndex.chunk_size === (settings.chunk_size || 7) && storedIndex.chunk_overlap === (settings.chunk_overlap || 2)) {
          const tuple = raw.find(([idx]) => idx === chunkIndex);
          if (tuple) {
            c = {
              id: chunkId,
              surah_number: surahNumber,
              chunk_index: tuple[0],
              start_verse: tuple[1],
              end_verse: tuple[2],
              status: "not_started",
            };
          }
        }

        if (!c) {
          const surahList = await fetchSurahList();
          const surahMeta = surahList.find((surah) => surah.number === surahNumber);
          if (surahMeta) {
            const generated = generateChunks(surahMeta.total_verses, settings.chunk_size || 7, settings.chunk_overlap || 2);
            const fallback = generated.find((chunk) => chunk.chunk_index === chunkIndex);
            if (fallback) {
              c = {
                id: chunkId,
                surah_number: surahNumber,
                chunk_index: fallback.chunk_index,
                start_verse: fallback.start_verse,
                end_verse: fallback.end_verse,
                status: "not_started",
              };
            }
          }
        }
      }
    }

    if (!c) { navigate("/Home"); return; }

    setChunk(c);
    const surahData = await fetchSurahVersesForLanguage(
      c.surah_number,
      settings.display_language || "en",
      settings.quran_riwaya || "warsh",
      settings.transliteration_language || "en",
      settings.transliteration_source || "standard"
    );
    setSurah(surahData);
    const cv = surahData.verses.filter(v => v.number >= c.start_verse && v.number <= c.end_verse);
    setVerses(cv);
    setLoading(false);
    await requestPermissionAndStart();
  }

  async function requestPermissionAndStart() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMediaStream(stream);
      startSessionTimer();
      startVerseTimer();
      beginRecording(stream);
    } catch {
      setPermissionError(true);
    }
  }

  function startSessionTimer() {
    clearInterval(sessionTimerRef.current);
    sessionTimerRef.current = setInterval(() => setSessionElapsed(e => e + 1), 1000);
  }

  function startVerseTimer() {
    clearInterval(verseTimerRef.current);
    setVerseElapsed(0);
    verseTimerRef.current = setInterval(() => setVerseElapsed(e => e + 1), 1000);
  }

  function beginRecording(stream) {
    if (!stream) return;
    audioChunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  }

  function stopCurrentRecording() {
    return new Promise(resolve => {
      const rec = mediaRecorderRef.current;
      if (!rec || rec.state === "inactive") { resolve(null); return; }
      rec.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        resolve(blob);
      };
      rec.stop();
    });
  }

  const handleNext = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    clearInterval(verseTimerRef.current);
    setIsRecording(false);
    const blob = await stopCurrentRecording();
    if (blob) verseBlobs.current[currentVerseIndex] = blob;
    const isLast = currentVerseIndex === verses.length - 1;
    if (isLast) {
      clearInterval(sessionTimerRef.current);
      setShowSaveDialog(true);
      setRecordingName(`Session ${new Date().toLocaleDateString()}`);
      setIsProcessing(false);
    } else {
      setRecordedFiles(prev => [...prev, { verseIndex: currentVerseIndex, duration: verseElapsed }]);
      const next = currentVerseIndex + 1;
      setCurrentVerseIndex(next);
      setHelperText("Recite, then tap Next");
      setVerseElapsed(0);
      startVerseTimer();
      beginRecording(streamRef.current);
      setIsProcessing(false);
    }
  }, [isProcessing, currentVerseIndex, verses.length, verseElapsed]);

  const handleRedo = useCallback(async () => {
    if (isProcessing) return;
    setIsRecording(false);
    clearInterval(verseTimerRef.current);
    await stopCurrentRecording();
    delete verseBlobs.current[currentVerseIndex];
    setHelperText("Re-recording... Tap Next when done");
    setVerseElapsed(0);
    startVerseTimer();
    beginRecording(streamRef.current);
  }, [isProcessing, currentVerseIndex]);

  const handlePreview = useCallback(async () => {
    if (isPreviewing) {
      previewAudioRef.current?.pause();
      setIsPreviewing(false);
      setHelperText("Recite, then tap Next");
      setVerseElapsed(0);
      startVerseTimer();
      beginRecording(streamRef.current);
      return;
    }
    const blob = verseBlobs.current[currentVerseIndex];
    if (!blob) return;
    setIsRecording(false);
    clearInterval(verseTimerRef.current);
    await stopCurrentRecording();
    setIsPreviewing(true);
    if (currentBlobUrlRef.current) URL.revokeObjectURL(currentBlobUrlRef.current);
    const url = URL.createObjectURL(blob);
    currentBlobUrlRef.current = url;
    const audio = new Audio(url);
    previewAudioRef.current = audio;
    audio.onended = () => {
      setIsPreviewing(false);
      setHelperText("Recite, then tap Next");
      delete verseBlobs.current[currentVerseIndex];
      setVerseElapsed(0);
      startVerseTimer();
      beginRecording(streamRef.current);
    };
    audio.play().catch(() => { setIsPreviewing(false); });
  }, [isPreviewing, currentVerseIndex]);

  async function handleSave() {
    setSaving(true);
    const verseFileObjs = [];
    let totalMs = 0;
    for (let i = 0; i <= currentVerseIndex; i++) {
      const blob = verseBlobs.current[i];
      if (!blob) continue;
      const file_url = await storeAudioBlob(blob);
      const durMs = (recordedFiles.find(r => r.verseIndex === i)?.duration || 5) * 1000;
      verseFileObjs.push({ verse_number: verses[i]?.number, file_url, duration_ms: durMs });
      totalMs += durMs;
    }
    const lastDuration = verseElapsed * 1000;
    totalMs += lastDuration;
    if (verseFileObjs.length < verses.length) {
      const lastBlob = verseBlobs.current[currentVerseIndex];
      if (lastBlob) {
        const file_url = await storeAudioBlob(lastBlob);
        verseFileObjs.push({ verse_number: verses[currentVerseIndex]?.number, file_url, duration_ms: lastDuration });
      }
    }
    await localEntities.Recording.create({
      chunk_id: chunkId,
      name: recordingName || "Recording",
      surah_number: chunk.surah_number,
      start_verse: chunk.start_verse,
      end_verse: chunk.end_verse,
      verse_files: verseFileObjs,
      total_duration_ms: totalMs,
    });
    await localEntities.Chunk.update(chunkId, { status: "in_progress" });
    setSaving(false);
    navigate(`/Home?chunk=${chunkId}`);
  }

  function handleCancel() {
    if (recordedFiles.length > 0 || currentVerseIndex > 0) {
      setShowCancelDialog(true);
    } else {
      doDiscard();
    }
  }

  function doDiscard() {
    stopAllTimers();
    stopStream();
    navigate("/Home");
  }

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ background: "linear-gradient(180deg, #0B5B3B 0%, #0E5B3D 50%, #0A412B 100%)" }}
      >
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#D4AF37" }} />
      </div>
    );
  }

  if (permissionError) {
    return (
      <div
        className="flex flex-col items-center justify-center h-screen gap-4 px-8 text-center"
        style={{ background: "linear-gradient(180deg, #0B5B3B 0%, #0E5B3D 100%)" }}
      >
        <div className="text-4xl">🎤</div>
        <h2 className="font-inter font-bold text-lg" style={{ color: "#F2D675" }}>Microphone Required</h2>
        <p className="text-sm font-inter" style={{ color: "rgba(240,230,200,0.7)" }}>
          Microphone access is required to record your recitation. Please enable it in your browser settings.
        </p>
        <button
          onClick={() => navigate("/Home")}
          className="px-6 py-2.5 rounded-xl font-inter font-semibold"
          style={{ background: "linear-gradient(160deg, #D4AF37, #8E6820)", color: "#2B241B" }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const isLast = currentVerseIndex === verses.length - 1;
  const currentVerse = verses[currentVerseIndex];
  const hasPreviewableAudio = !!verseBlobs.current[currentVerseIndex];

  return (
    <div
      className="flex flex-col h-screen overflow-hidden relative"
      style={{
        background: "linear-gradient(180deg, #0B5B3B 0%, #0E5B3D 42%, #136B47 60%, #0E5B3D 78%, #0A412B 100%)",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Full-screen arabesque overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: arabesque, backgroundSize: "48px 48px", opacity: 1 }}
      />
      {/* Radial spotlight around center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 48%, rgba(27,122,83,0.28) 0%, transparent 60%)",
        }}
      />
      {/* Edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(8,55,36,0.65) 100%)",
        }}
      />

      {/* ── Top Header ── */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
        {/* Close button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleCancel}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(0,0,0,0.28)",
            border: "1px solid rgba(212,175,55,0.3)",
          }}
        >
          <X className="w-4 h-4" style={{ color: "#D4AF37" }} />
        </motion.button>

        {/* Surah title center */}
        <div className="text-center flex-1 px-3">
          <p
            className="font-amiri leading-tight"
            style={{ fontSize: "17px", color: "#F2D675", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
          >
            {surah?.name_arabic}
          </p>
          <p
            className="font-inter font-medium"
            style={{ fontSize: "11px", color: "rgba(240,230,200,0.7)" }}
          >
            Verses {chunk?.start_verse}–{chunk?.end_verse}
          </p>
        </div>

        {/* Timer pill */}
        <RecordTimerPill sessionElapsed={sessionElapsed} isRecording={isRecording} />
      </div>

      {/* ── Progress Blocks ── */}
      <div className="relative z-10 flex-shrink-0">
        <VerseProgressTrack
          total={verses.length}
          recordedCount={recordedFiles.length}
          currentIndex={currentVerseIndex}
        />
      </div>

      {/* ── Verse counter label ── */}
      <div className="relative z-10 flex-shrink-0 text-center pb-2">
        <span
          className="font-inter font-semibold"
          style={{
            fontSize: "13px",
            color: "#E1BE59",
            textShadow: "0 0 12px rgba(225,190,89,0.4)",
            letterSpacing: "0.03em",
          }}
        >
          Verse {currentVerseIndex + 1} of {verses.length}
        </span>
      </div>

      {/* ── Verse Card (flex-1) ── */}
      <div className="relative z-10 flex-1 overflow-hidden flex flex-col justify-center min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVerseIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.24, ease: "easeInOut" }}
            className="flex flex-col"
          >
            <VerseCard verse={currentVerse} isLast={isLast} />

            {/* Waveform (integrated at bottom of card area) */}
            <div className="mx-4 mt-0 rounded-b-2xl overflow-hidden" style={{
              background: "linear-gradient(180deg, rgba(248,243,232,0.08) 0%, rgba(10,65,43,0.6) 100%)",
              borderLeft: "2.5px solid rgba(212,175,55,0.18)",
              borderRight: "2.5px solid rgba(212,175,55,0.18)",
              borderBottom: "2.5px solid rgba(212,175,55,0.18)",
            }}>
              <WaveformVisualizer stream={mediaStream} isRecording={isRecording} verseElapsed={verseElapsed} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Actions area ── */}
      <div className="relative z-10 flex-shrink-0 pt-3 pb-6 space-y-2.5">
        {/* Primary CTA */}
        <PrimaryGoldButton
          onClick={handleNext}
          disabled={isProcessing || isPreviewing}
          isLast={isLast}
          isProcessing={isProcessing}
        />

        {/* Helper text */}
        <div className="flex items-center justify-center gap-2 px-6">
          <div style={{ height: "1px", flex: 1, background: "linear-gradient(to right, transparent, rgba(212,175,55,0.4))" }} />
          <span
            className="font-inter italic text-center"
            style={{ fontSize: "11.5px", color: "#E3C96C" }}
          >
            {isPreviewing ? "Previewing — tap Preview to resume" : helperText}
          </span>
          <div style={{ height: "1px", flex: 1, background: "linear-gradient(to left, transparent, rgba(212,175,55,0.4))" }} />
        </div>

        {/* Secondary buttons */}
        <div className="flex items-center justify-center gap-3 px-4">
          <SecondaryButton
            onClick={handleRedo}
            disabled={isProcessing || isPreviewing}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            label="Redo"
            variant="green"
          />
          <SecondaryButton
            onClick={handlePreview}
            disabled={isProcessing || (!hasPreviewableAudio && !isPreviewing)}
            icon={isPreviewing
              ? <Square className="w-3.5 h-3.5" fill="currentColor" />
              : <Play className="w-3.5 h-3.5" fill="currentColor" />
            }
            label={isPreviewing ? "Stop" : "Preview"}
            variant={isPreviewing ? "preview-active" : "parchment"}
          />
        </div>
      </div>

      {/* ── Save Dialog ── */}
      <Dialog open={showSaveDialog} onOpenChange={() => {}}>
        <DialogContent
          className="max-w-sm mx-auto rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #F8F3E8 0%, #F1E8D5 100%)",
            border: "2px solid #D4AF37",
            boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="font-inter font-bold text-center text-lg" style={{ color: "#0E5B3D" }}>
              ✅ Recording Complete
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div
              className="rounded-2xl p-3 space-y-1.5 text-sm font-inter"
              style={{ background: "rgba(14,91,61,0.07)", border: "1px solid rgba(212,175,55,0.3)" }}
            >
              <div className="flex items-center gap-2" style={{ color: "#213226" }}><span>📖</span><span>{surah?.name_english}</span></div>
              <div className="flex items-center gap-2" style={{ color: "#213226" }}><span>📍</span><span>Verses {chunk?.start_verse}–{chunk?.end_verse}</span></div>
              <div className="flex items-center gap-2" style={{ color: "#213226" }}><span>⏱️</span><span>{fmt(sessionElapsed)} total</span></div>
              <div className="flex items-center gap-2" style={{ color: "#213226" }}><span>🎙️</span><span>{verses.length} verses recorded</span></div>
            </div>
            <div>
              <label className="text-xs font-inter font-medium mb-1.5 block" style={{ color: "#6B6253" }}>Name your recording</label>
              <Input
                value={recordingName}
                onChange={e => setRecordingName(e.target.value)}
                placeholder="Morning Session 1"
                className="font-inter"
                style={{ background: "#FFF9F0", border: "1px solid #D4AF37" }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="flex-col gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 rounded-xl font-inter font-bold relative overflow-hidden disabled:opacity-60"
              style={{
                background: "linear-gradient(160deg, #D4AF37 0%, #B98218 60%, #8E6415 100%)",
                color: "#2B241B",
                boxShadow: "0 3px 14px rgba(183,130,24,0.45)",
              }}
            >
              {saving ? "Saving..." : "💾 Save Recording"}
            </button>
            <button
              onClick={doDiscard}
              className="text-sm font-inter text-center"
              style={{ color: "#A92E16" }}
            >
              🗑️ Discard
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Cancel Confirmation ── */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent
          className="max-w-sm rounded-2xl"
          style={{
            background: "linear-gradient(160deg, #F8F3E8 0%, #F1E8D5 100%)",
            border: "2px solid #D4AF37",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-inter" style={{ color: "#213226" }}>Discard recording?</AlertDialogTitle>
            <AlertDialogDescription className="font-inter" style={{ color: "#6B6253" }}>
              You've recorded {recordedFiles.length} of {verses.length} verses. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-inter">Keep</AlertDialogCancel>
            <AlertDialogAction
              onClick={doDiscard}
              style={{ background: "#A92E16", color: "white" }}
              className="font-inter"
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}