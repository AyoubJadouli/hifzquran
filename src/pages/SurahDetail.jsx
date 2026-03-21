import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { localChunkIndex, localEntities } from "../components/localData";
import { fetchSurahVersesForLanguage, generateChunks } from "../components/quranData";
import { getAppT } from "../components/appI18n";
import { useSettings } from "../components/useSettings";
import { ArrowLeft, Mic, Play, Loader2, CheckCircle2, Circle, Clock, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { useThemeColors } from "../components/useThemeColors";

export default function SurahDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const t = useThemeColors();
  const surahId = parseInt(searchParams.get("id") || "1", 10);
  const { settings, updateSettings } = useSettings();
  const i18n = getAppT(settings.display_language);

  const [surah, setSurah] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [loading, setLoading] = useState(true);

  function normalizeChunkRecord(chunk) {
    return {
      ...chunk,
      surah_number: surahId,
      status: chunk.status || "not_started",
      listen_count: chunk.listen_count || 0,
      recitation_attempts: chunk.recitation_attempts || 0,
      recite_prompt_dismissed: chunk.recite_prompt_dismissed || false,
    };
  }

  async function getIndexedChunksForSurah(totalVerses) {
    const storedIndex = await localChunkIndex.get();
    const indexSurahs = storedIndex?.surahs || {};
    const raw = indexSurahs[String(surahId)] || indexSurahs[surahId];

    if (raw && storedIndex.chunk_size === (settings.chunk_size || 7) && storedIndex.chunk_overlap === (settings.chunk_overlap || 2)) {
      return raw.map(([chunk_index, start_verse, end_verse]) => ({
        id: `idx_${surahId}_${chunk_index}`,
        surah_number: surahId,
        chunk_index,
        start_verse,
        end_verse,
        status: "not_started",
        listen_count: 0,
        recitation_attempts: 0,
        recite_prompt_dismissed: false,
      }));
    }

    return generateChunks(totalVerses, settings.chunk_size || 7, settings.chunk_overlap || 2).map((chunk) => ({
      ...chunk,
      id: `runtime_${surahId}_${chunk.chunk_index}`,
      surah_number: surahId,
      status: "not_started",
      listen_count: 0,
      recitation_attempts: 0,
      recite_prompt_dismissed: false,
    }));
  }

  useEffect(() => { loadSurah(); }, [
    surahId,
    settings.display_language,
    settings.quran_riwaya,
    settings.transliteration_language,
    settings.transliteration_source,
  ]);

  async function loadSurah() {
    setLoading(true);
    const surahData = await fetchSurahVersesForLanguage(
      surahId,
      settings.display_language || "en",
      settings.quran_riwaya || "warsh",
      settings.transliteration_language || "en",
      settings.transliteration_source || "standard"
    );
    setSurah(surahData);
    let existingChunks = (await localEntities.Chunk.filter({ surah_number: surahId }, "chunk_index")).map(normalizeChunkRecord);
    const expected = generateChunks(surahData.total_verses, settings.chunk_size || 7, settings.chunk_overlap || 2);
    const matchesExpected =
      existingChunks.length === expected.length &&
      existingChunks.every((chunk, index) =>
        chunk.chunk_index === expected[index].chunk_index &&
        chunk.start_verse === expected[index].start_verse &&
        chunk.end_verse === expected[index].end_verse
      );

    if (!matchesExpected) {
      existingChunks = await getIndexedChunksForSurah(surahData.total_verses);
    }
    setChunks(existingChunks);
    setLoading(false);
  }

  function goToChunk(chunk) {
    updateSettings({ last_surah_number: surahId, last_chunk_id: chunk.id });
    navigate("/Home");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full" style={{ background: t.pageBg }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: t.gold }} />
      </div>
    );
  }

  const completedCount = chunks.filter(c => c.status === "completed").length;
  const progressPct = chunks.length > 0 ? completedCount / chunks.length : 0;

  const statusConfig = {
    not_started: { icon: Circle, iconColor: t.textMuted },
    in_progress: { icon: Clock, iconColor: "#C9971E" },
    completed: { icon: CheckCircle2, iconColor: "#2ecc71" },
  };

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: t.pageBg, backgroundImage: t.pageBgPattern, backgroundSize: "48px 48px" }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 relative overflow-hidden"
        style={{ background: t.headerBg, boxShadow: "0 4px 20px rgba(0,0,0,0.4)", paddingTop: "16px", paddingBottom: "28px" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: t.pageBgPattern, backgroundSize: "48px 48px" }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: "1.5px", background: `linear-gradient(to right, transparent, ${t.goldLight} 20%, ${t.gold} 50%, ${t.goldLight} 80%, transparent)` }} />

        <div className="relative z-10 px-5">
          <div className="flex items-center gap-2 mb-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/Surahs")}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.28)", border: `1px solid ${t.cardBorder}` }}
            >
              <ArrowLeft className="w-4 h-4" style={{ color: t.gold }} />
            </motion.button>
            <span className="font-inter text-sm" style={{ color: t.headerSubtext }}>{i18n.surahDetailBackToSurahs}</span>
          </div>

          <div className="text-center">
            <p className="font-amiri" style={{ fontSize: "28px", color: t.goldLight, textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>{surah?.name_arabic}</p>
            <p className="font-inter font-bold" style={{ fontSize: "16px", color: t.textOnDark, marginTop: "2px" }}>{surah?.name_english}</p>
            <p className="font-inter" style={{ fontSize: "11px", color: t.headerSubtext, marginTop: "3px" }}>
              {surah?.name_translation} · {i18n.commonVerseCount({ count: surah?.total_verses })} · {surah?.revelation_type}
            </p>

            <div className="mt-4 mx-8">
              <div className="rounded-full overflow-hidden" style={{ height: "6px", background: "rgba(255,255,255,0.1)", border: `1px solid ${t.cardBorder}` }}>
                <div className="h-full rounded-full" style={{
                  width: `${progressPct * 100}%`,
                  background: `linear-gradient(90deg, ${t.gold}, ${t.goldLight})`,
                  transition: "width 0.8s ease-out",
                  boxShadow: `0 0 6px rgba(212,175,55,0.4)`,
                }} />
              </div>
              <p className="font-inter text-center mt-1" style={{ fontSize: "10px", color: t.headerSubtext }}>
                {i18n.commonChunksCompleted({ completed: completedCount, total: chunks.length })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chunks */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4">
        <div className="space-y-2.5">
          {chunks.map((chunk, i) => {
            const status = statusConfig[chunk.status] || statusConfig.not_started;
            const StatusIcon = status.icon;
            return (
              <motion.div
                key={chunk.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="relative overflow-hidden"
                style={{
                  background: t.cardBg,
                  border: `1px solid ${t.cardBorder}`,
                  borderRadius: "16px",
                  boxShadow: t.cardShadow,
                  padding: "14px",
                }}
              >
                <span className="absolute top-1.5 right-2.5 select-none pointer-events-none" style={{ color: t.gold, fontSize: "8px", opacity: 0.3 }}>◆</span>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `rgba(212,175,55,0.1)`,
                        border: `1px solid ${t.cardBorder}`,
                      }}
                    >
                      <StatusIcon style={{ color: status.iconColor, width: "18px", height: "18px" }} />
                    </div>
                    <div>
                      <p className="font-inter font-semibold" style={{ fontSize: "13px", color: t.textPrimary }}>{i18n.commonChunk({ index: i + 1 })}</p>
                      <p className="font-inter" style={{ fontSize: "10.5px", color: t.textMuted, marginTop: "1px" }}>
                        {i18n.commonVerseRange({ start: chunk.start_verse, end: chunk.end_verse })}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigate(`/app/Record?chunkId=${chunk.id}`)}
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{
                        background: t.greenBtnBg,
                        border: `1px solid ${t.cardBorder}`,
                        boxShadow: t.greenBtnShadow,
                      }}
                    >
                      <Mic className="w-4 h-4" style={{ color: t.gold }} />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigate(`/app/recite/${chunk.id}`)}
                      disabled={chunk.status !== "completed" && chunk.status !== "in_progress"}
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{
                        background: t.goldGradient,
                        border: `1px solid ${t.goldDark}`,
                        boxShadow: t.goldShadow,
                        opacity: chunk.status !== "completed" && chunk.status !== "in_progress" ? 0.45 : 1,
                      }}
                      title={chunk.status !== "completed" && chunk.status !== "in_progress" ? i18n.surahDetailRecordFirst : i18n.surahDetailRecite}
                    >
                      <Brain className="w-4 h-4" style={{ color: "#2B241B" }} />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => goToChunk(chunk)}
                      className="w-9 h-9 rounded-full flex items-center justify-center relative overflow-hidden"
                      style={{
                        background: t.goldGradient,
                        border: `1px solid ${t.goldDark}`,
                        boxShadow: t.goldShadow,
                      }}
                    >
                      <Play className="w-4 h-4 ml-0.5" style={{ color: "#2B241B" }} fill="#2B241B" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}