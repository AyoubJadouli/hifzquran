import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSurahList } from "../components/quranData";
import { getAppT } from "../components/appI18n";
import { useSettings } from "../components/useSettings";
import { Search, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useThemeColors } from "../components/useThemeColors";

export default function Surahs() {
  const navigate = useNavigate();
  const t = useThemeColors();
  const { settings } = useSettings();
  const i18n = getAppT(settings.display_language);
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { loadSurahs(); }, []);

  async function loadSurahs() {
    const list = await fetchSurahList();
    setSurahs(list);
    setLoading(false);
  }

  const filtered = surahs.filter(s =>
    s.name_english.toLowerCase().includes(search.toLowerCase()) ||
    s.name_arabic.includes(search) ||
    String(s.number).includes(search)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full" style={{ background: t.pageBg }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: t.gold }} />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: t.pageBg, backgroundImage: t.pageBgPattern, backgroundSize: "48px 48px" }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 pt-5 pb-6 relative overflow-hidden"
        style={{ background: t.headerBg, boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: t.pageBgPattern, backgroundSize: "48px 48px" }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: "1.5px", background: `linear-gradient(to right, transparent, ${t.goldLight} 20%, ${t.gold} 50%, ${t.goldLight} 80%, transparent)` }} />

        <div className="relative z-10">
          <p className="font-amiri text-center" style={{ fontSize: "22px", color: t.goldLight, textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
            قائمة السور
          </p>
          <p className="font-inter font-bold text-center" style={{ fontSize: "15px", color: t.textOnDark, marginTop: "2px" }}>
            {i18n.navSurahs}
          </p>
          <p className="font-inter text-center" style={{ fontSize: "11px", color: t.headerSubtext, marginTop: "2px" }}>
            {i18n.surahsHeaderStats({ surahCount: surahs.length, verseCount: "6,236" })}
          </p>

          {/* Search bar */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: t.gold }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={i18n.commonSearchSurahs}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl font-inter text-sm outline-none"
              style={{
                background: "rgba(0,0,0,0.2)",
                border: `1px solid ${t.cardBorder}`,
                color: t.textOnDark,
              }}
            />
          </div>
        </div>
      </div>

      {/* Surah list */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="space-y-2">
          {filtered.map((surah, i) => (
            <motion.button
              key={surah.number}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.015, 0.4) }}
              onClick={() => navigate(`/SurahDetail?id=${surah.number}`)}
              className="w-full text-left relative overflow-hidden"
              style={{
                background: t.cardBg,
                border: `1px solid ${t.cardBorder}`,
                borderRadius: "16px",
                boxShadow: t.cardShadow,
                padding: "12px 14px",
              }}
            >
              <span className="absolute top-1.5 right-2.5 select-none pointer-events-none" style={{ color: t.gold, fontSize: "8px", opacity: 0.3 }}>◆</span>

              <div className="flex items-center gap-3">
                {/* Number medallion */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                  style={{
                    background: t.goldGradient,
                    boxShadow: t.goldShadow,
                    border: `1px solid ${t.goldDark}`,
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 rounded-t-full" style={{ height: "44%", background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)" }} />
                  <span className="font-inter font-bold relative z-10" style={{ fontSize: "11px", color: "#2B241B" }}>{surah.number}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-inter font-semibold" style={{ fontSize: "13px", color: t.textPrimary }}>{surah.name_english}</p>
                  <p className="font-inter" style={{ fontSize: "10.5px", color: t.textMuted, marginTop: "1px" }}>
                    {surah.name_translation} · {i18n.commonVerseCount({ count: surah.total_verses })}
                  </p>
                  <div className="mt-1.5 rounded-full overflow-hidden" style={{ height: "3px", background: `rgba(212,175,55,0.12)` }}>
                    <div className="h-full rounded-full" style={{ width: "0%", background: `linear-gradient(90deg, ${t.gold}, ${t.goldLight})` }} />
                  </div>
                </div>

                {/* Arabic name */}
                <p className="font-amiri flex-shrink-0" style={{ fontSize: "18px", color: t.gold }}>{surah.name_arabic}</p>

                {/* Revelation type + arrow */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span
                    className="font-inter font-medium"
                    style={{
                      fontSize: "9px",
                      padding: "2px 7px",
                      borderRadius: "20px",
                      background: `rgba(212,175,55,0.12)`,
                      color: t.gold,
                      border: `1px solid rgba(212,175,55,0.28)`,
                    }}
                  >
                    {surah.revelation_type}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" style={{ color: t.gold }} />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}