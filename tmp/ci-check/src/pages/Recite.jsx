import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { localEntities } from "../components/localData";
import { deleteAudioBlob, resolveAudioUrl, storeAudioBlob } from "../components/fileStorage";
import { fetchSurahVerses } from "../components/quranData";
import WaveformVisualizer from "../components/record/WaveformVisualizer";
import { X, Check, XIcon, Play, Pause, RotateCcw, Sparkles } from "lucide-react";

const MIN_SECONDS = 5;
const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function Recite() {
  const { chunkId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [chunk, setChunk] = useState(null);
  const [surah, setSurah] = useState(null);
  const [verses, setVerses] = useState([]);

  const [phase, setPhase] = useState("blind"); // blind|transition|revise
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);
  const recRef = useRef(null);
  const chunksRef = useRef([]);

  const [audioFileRef, setAudioFileRef] = useState(null);
  const [durationMs, setDurationMs] = useState(0);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [confidence, setConfidence] = useState({});

  const [playbackState, setPlaybackState] = useState("idle");
  const [position, setPosition] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const audioRef = useRef(null);
  const playbackTimerRef = useRef(null);
  const autoTransitionRef = useRef(null);

  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [showLowConfidenceConfirm, setShowLowConfidenceConfirm] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [nextChunk, setNextChunk] = useState(null);

  useEffect(() => {
    load();
    return () => cleanupAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chunkId]);

  const correctVerses = useMemo(
    () => Object.values(confidence).filter(Boolean).length,
    [confidence]
  );

  async function load() {
    setLoading(true);
    const chunks = await localEntities.Chunk.filter({ id: chunkId });
    if (!chunks.length) {
      navigate("/app/Home");
      return;
    }
    const c = chunks[0];
    setChunk(c);

    const surahData = await fetchSurahVerses(c.surah_number);
    setSurah(surahData);
    const v = surahData.verses.filter(
      (x) => x.number >= c.start_verse && x.number <= c.end_verse
    );
    setVerses(v);
    setConfidence(Object.fromEntries(v.map((x) => [x.number, true])));

    const attempts = await localEntities.RecitationAttempt.filter({ chunk_id: c.id });
    setAttemptNumber((attempts?.length || 0) + 1);

    setLoading(false);
    await startRecording();
  }

  async function startRecording() {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(userStream);
      chunksRef.current = [];

      const rec = new MediaRecorder(userStream);
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.start();
      recRef.current = rec;
      setIsRecording(true);
      setElapsed(0);
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } catch {
      navigate("/app/Home");
    }
  }

  function stopStream() {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    setStream(null);
  }

  async function stopRecording() {
    if (elapsed < MIN_SECONDS) {
      alert("Please recite before stopping. Minimum 5 seconds required.");
      return;
    }
    const rec = recRef.current;
    if (!rec || rec.state === "inactive") return;

    const blob = await new Promise((resolve) => {
      rec.onstop = () => resolve(new Blob(chunksRef.current, { type: "audio/webm" }));
      rec.stop();
    });

    clearInterval(timerRef.current);
    setIsRecording(false);
    stopStream();

    const fileRef = await storeAudioBlob(blob);
    setAudioFileRef(fileRef);
    setDurationMs(elapsed * 1000);
    setPhase("transition");
    clearTimeout(autoTransitionRef.current);
    autoTransitionRef.current = setTimeout(() => setPhase("revise"), 2000);
  }

  function prepareAudio(url) {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    const audio = new Audio(url);
    audio.playbackRate = playbackSpeed;
    audio.onloadedmetadata = () => setTotalDuration(Math.floor(audio.duration || 0));
    audio.ontimeupdate = () => setPosition(Math.floor(audio.currentTime || 0));
    audio.onended = () => setPlaybackState("idle");
    audioRef.current = audio;
  }

  async function togglePlay() {
    if (!audioFileRef) {
      alert("Recording failed. Please try again.");
      handleTryAgain();
      return;
    }
    if (!audioRef.current) {
      const url = await resolveAudioUrl(audioFileRef);
      if (!url) {
        alert("Recording failed. Please try again.");
        handleTryAgain();
        return;
      }
      prepareAudio(url);
    }

    if (playbackState === "playing") {
      audioRef.current.pause();
      setPlaybackState("paused");
    } else {
      audioRef.current.playbackRate = playbackSpeed;
      await audioRef.current.play().catch(() => {});
      setPlaybackState("playing");
      clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = setInterval(() => {
        if (audioRef.current) setPosition(Math.floor(audioRef.current.currentTime || 0));
      }, 250);
    }
  }

  function onSeek(nextValue) {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Number(nextValue);
    setPosition(Number(nextValue));
  }

  async function handleTryAgain() {
    if (audioFileRef) await deleteAudioBlob(audioFileRef);
    setAudioFileRef(null);
    setDurationMs(0);
    setPhase("blind");
    setPlaybackState("idle");
    setPosition(0);
    setTotalDuration(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setAttemptNumber((a) => a + 1);
    await startRecording();
  }

  async function doValidate() {
    const attempt = await localEntities.RecitationAttempt.create({
      chunk_id: chunk.id,
      attempted_at: new Date().toISOString(),
      audio_file_path: audioFileRef,
      duration_ms: durationMs,
      total_verses: verses.length,
      correct_verses: correctVerses,
      validated: true,
      attempt_number: attemptNumber,
    });

    const now = new Date().toISOString();
    const recitationAttempts = (chunk.recitation_attempts || 0) + 1;
    await localEntities.Chunk.update(chunk.id, {
      status: "completed",
      completed_at: now,
      last_recitation_attempt_id: attempt.id,
      recitation_attempts: recitationAttempts,
    });

    const allChunks = await localEntities.Chunk.filter({ surah_number: chunk.surah_number }, "chunk_index");
    const idx = allChunks.findIndex((c) => c.id === chunk.id);
    setNextChunk(idx >= 0 && idx < allChunks.length - 1 ? allChunks[idx + 1] : null);
    setShowCelebration(true);
  }

  async function handleValidatePress() {
    if (correctVerses < verses.length) {
      setShowLowConfidenceConfirm(true);
      return;
    }
    await doValidate();
  }

  async function goStartNextChunk() {
    const list = await localEntities.UserSettings.list();
    if (nextChunk) {
      if (list[0]?.id) {
        await localEntities.UserSettings.update(list[0].id, {
          last_surah_number: nextChunk.surah_number,
          last_chunk_id: nextChunk.id,
        });
      }
    }
    navigate("/app/Home");
  }

  async function handleClose() {
    if (phase === "blind" && isRecording) {
      setShowDiscardConfirm(true);
      return;
    }
    navigate("/app/Home");
  }

  async function discardAndExit() {
    if (audioFileRef) await deleteAudioBlob(audioFileRef);
    navigate("/app/Home");
  }

  function cleanupAll() {
    clearInterval(timerRef.current);
    clearInterval(playbackTimerRef.current);
    clearTimeout(autoTransitionRef.current);
    stopStream();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  }

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  if (loading) return <div className="h-screen grid place-items-center bg-[#0A412B] text-[#D4AF37]">Loading...</div>;

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "linear-gradient(180deg, #0B5B3B 0%, #0A412B 100%)" }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#D4AF3733]">
        <button onClick={handleClose} className="w-9 h-9 rounded-full border border-[#D4AF3760] text-[#D4AF37] grid place-items-center"><X size={16} /></button>
        <div className="text-center">
          <p className="text-[#F2D675] font-semibold">{phase === "revise" ? "📖 Revise & Validate" : "🧠 Recite from Memory"}</p>
          <p className="text-[#E9D8A6] text-xs">{surah?.name_arabic} · Verses {chunk?.start_verse}–{chunk?.end_verse}</p>
        </div>
        <div className="text-[#F2D675] font-mono text-sm">{phase === "blind" ? `🔴 ${fmt(elapsed)}` : `${fmt(position)} / ${fmt(totalDuration || durationMs / 1000)}`}</div>
      </div>

      {phase === "blind" && (
        <>
          <div className="px-6 pt-6 text-center text-[#F2D675]">
            <p className="font-amiri text-2xl">{surah?.name_arabic}</p>
            <p className="text-sm">{surah?.name_english} · Verses {chunk?.start_verse}–{chunk?.end_verse}</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="text-5xl mb-4 opacity-80">🕌</div>
            <p className="text-[#F8EDD0] text-xl font-semibold">Recite the entire chunk from memory</p>
            <p className="text-[#E9D8A6] mt-2">No peeking — trust your Hifz!</p>
          </div>
          <div className="px-4"><WaveformVisualizer stream={stream} isRecording={isRecording} verseElapsed={elapsed} /></div>
          <div className="p-4">
            <button onClick={stopRecording} className="w-full h-14 rounded-2xl bg-red-700 text-white font-semibold">■ STOP RECORDING</button>
            <p className="text-center text-[#E9D8A6] text-xs mt-2">When you've finished reciting, tap Stop</p>
          </div>
        </>
      )}

      {phase === "transition" && (
        <div className="flex-1 grid place-items-center px-6 text-center text-[#F2D675]">
          <div>
            <p className="text-5xl mb-3">✅</p>
            <p className="text-2xl font-semibold">Recording Saved!</p>
            <p className="mt-1">{fmt(durationMs / 1000)} total</p>
            <p className="mt-5 text-[#E9D8A6]">Now let's check your recitation against the Quran text.</p>
            <button onClick={() => setPhase("revise")} className="mt-5 px-6 h-11 rounded-xl border border-[#D4AF37] text-[#F2D675]">📖 REVISE RECITATION</button>
          </div>
        </div>
      )}

      {phase === "revise" && (
        <>
          <div className="px-4 pt-3">
            <div className="rounded-2xl border border-[#D4AF3745] bg-[#0F513222] p-3 text-[#F2D675]">
              <div className="flex items-center gap-3">
                <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-[#D4AF37] text-[#2B241B] grid place-items-center">
                  {playbackState === "playing" ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </button>
                <input type="range" min={0} max={Math.max(totalDuration, 1)} value={position} onChange={(e) => onSeek(e.target.value)} className="flex-1" />
                <select value={playbackSpeed} onChange={(e) => setPlaybackSpeed(Number(e.target.value))} className="bg-transparent border border-[#D4AF37] rounded px-2 py-1 text-xs">
                  {speeds.map((s) => <option key={s} value={s}>{s.toFixed(2).replace(/\.00$/, "")}x</option>)}
                </select>
              </div>
              <p className="text-xs mt-2 text-[#E9D8A6]">Listen to your blind recitation while reading along</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {verses.map((v) => {
              const ok = confidence[v.number] !== false;
              return (
                <div key={v.number} className="rounded-2xl border border-[#D4AF3745] bg-[#F8F3E80D] p-3 text-[#F8EDD0]">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full border border-[#D4AF37] grid place-items-center text-xs">{v.number}</div>
                    <div className="flex-1">
                      <p dir="rtl" className="font-amiri text-2xl leading-loose">{v.arabic}</p>
                      <p className="text-sm text-[#E9D8A6]">{v.transliteration}</p>
                      <p className="text-xs text-[#D7CCB0]">{v.translation}</p>
                    </div>
                    <button
                      onClick={() => setConfidence((c) => ({ ...c, [v.number]: !ok }))}
                      className={`w-9 h-9 rounded-lg grid place-items-center ${ok ? "bg-emerald-700" : "bg-red-700"}`}
                    >
                      {ok ? <Check size={18} /> : <XIcon size={18} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-[#D4AF3733] space-y-2">
            <p className="text-[#F2D675] text-sm">Confidence: {correctVerses}/{verses.length} verses marked correct</p>
            <button onClick={handleValidatePress} className="w-full h-12 rounded-xl bg-emerald-700 text-white font-semibold">✅ VALIDATE — I've Memorized This Chunk</button>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleTryAgain} className="h-11 rounded-xl border border-[#D4AF37] text-[#F2D675]">🔄 Try Again</button>
              <button onClick={() => navigate("/app/Home")} className="h-11 rounded-xl border border-[#D4AF37] text-[#F2D675]">← Keep Practicing</button>
            </div>
          </div>
        </>
      )}

      {showDiscardConfirm && (
        <div className="absolute inset-0 bg-black/60 grid place-items-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#133a2b] border border-[#D4AF37] p-4 text-[#F2D675]">
            <p className="font-semibold">Discard recitation attempt?</p>
            <p className="text-sm text-[#E9D8A6] mt-1">Your blind recitation will be deleted.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowDiscardConfirm(false)} className="px-3 h-9 rounded-lg border border-[#D4AF37]">Keep</button>
              <button onClick={discardAndExit} className="px-3 h-9 rounded-lg bg-red-700 text-white">Discard</button>
            </div>
          </div>
        </div>
      )}

      {showLowConfidenceConfirm && (
        <div className="absolute inset-0 bg-black/60 grid place-items-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#133a2b] border border-[#D4AF37] p-4 text-[#F2D675]">
            <p className="font-semibold">You marked {verses.length - correctVerses} verses incorrect. Are you sure?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowLowConfidenceConfirm(false)} className="px-3 h-9 rounded-lg border border-[#D4AF37]">Go Back</button>
              <button onClick={async () => { setShowLowConfidenceConfirm(false); await doValidate(); }} className="px-3 h-9 rounded-lg bg-emerald-700 text-white">Validate Anyway</button>
            </div>
          </div>
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-black/60 grid place-items-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#133a2b] border border-[#D4AF37] p-5 text-[#F2D675] text-center">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-2xl font-semibold">Masha'Allah!</p>
            <p className="mt-3">You've memorized: {surah?.name_english} · Verses {chunk?.start_verse}–{chunk?.end_verse}</p>
            <p className="text-sm text-[#E9D8A6] mt-1">Confidence: {correctVerses}/{verses.length} · Time: {fmt(durationMs / 1000)}</p>
            <div className="mt-4 text-sm">
              {nextChunk ? (
                <>
                  <p className="mb-2">Next chunk unlocked: Verses {nextChunk.start_verse}–{nextChunk.end_verse}</p>
                  <button onClick={goStartNextChunk} className="w-full h-11 rounded-xl bg-[#D4AF37] text-[#2B241B] font-semibold">▶ START NEXT CHUNK</button>
                </>
              ) : (
                <p>🎉 You've completed {surah?.name_english}!</p>
              )}
            </div>
            <button onClick={() => navigate("/app/Home")} className="mt-3 text-[#E9D8A6] inline-flex items-center gap-1"><Sparkles size={14} /> Back to Home</button>
          </div>
        </div>
      )}
    </div>
  );
}
