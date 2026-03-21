import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { fetchSurahList, fetchSurahVersesForLanguage } from "../components/quranData";
import { localEntities } from "../components/localData";
import { getAppT } from "../components/appI18n";
import { useSettings } from "../components/useSettings";
import { useThemeColors } from "../components/useThemeColors";
import { Bookmark, Loader2, MapPinned } from "lucide-react";

function getSajdaLabel(sajda) {
  if (!sajda) return null;
  if (typeof sajda === "object") {
    return sajda.recommended ? "Sajda" : "Obligatory Sajda";
  }
  return "Sajda";
}

export default function Reader() {
  const t = useThemeColors();
  const { settings } = useSettings();
  const i18n = getAppT(settings.display_language);

  const [surahs, setSurahs] = useState([]);
  const [surahNumber, setSurahNumber] = useState(1);
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmark, setBookmark] = useState(null);
  const [savingBookmark, setSavingBookmark] = useState(false);
  const [justMarkedAyah, setJustMarkedAyah] = useState(null);

  useEffect(() => {
    bootstrap();
  }, []);

  useEffect(() => {
    if (surahNumber) {
      loadSurah(surahNumber);
    }
  }, [surahNumber, settings.display_language, settings.quran_riwaya, settings.transliteration_language, settings.transliteration_source]);

  async function bootstrap() {
    setLoading(true);
    const [surahList, bookmarks] = await Promise.all([
      fetchSurahList(),
      localEntities.Bookmark.list("-updated_date", 1),
    ]);

    setSurahs(surahList);
    const activeBookmark = bookmarks[0] || null;
    setBookmark(activeBookmark);
    setSurahNumber(activeBookmark?.surah_number || settings.last_surah_number || 1);
    setLoading(false);
  }

  async function loadSurah(number) {
    setLoading(true);
    const surahData = await fetchSurahVersesForLanguage(
      number,
      settings.display_language || "en",
      settings.quran_riwaya || "warsh",
      settings.transliteration_language || "en",
      settings.transliteration_source || "standard"
    );
    setSurah(surahData);
    setLoading(false);
  }

  async function toggleBookmark(verse) {
    if (!surah || !verse || savingBookmark) return;
    setSavingBookmark(true);

    const existing = await localEntities.Bookmark.list("-updated_date", 1);
    const current = existing[0] || null;

    const payload = {
      surah_number: surah.number,
      ayah_number: verse.number,
      label: "last_read",
    };

    let nextBookmark;
    if (current) {
      nextBookmark = await localEntities.Bookmark.update(current.id, payload);
    } else {
      nextBookmark = await localEntities.Bookmark.create(payload);
    }

    setBookmark(nextBookmark);
    setJustMarkedAyah(`${surah.number}:${verse.number}`);
    setTimeout(() => setJustMarkedAyah(null), 900);
    setSavingBookmark(false);
  }

  function jumpToBookmark() {
    if (!bookmark || bookmark.surah_number !== surah?.number) {
      if (bookmark?.surah_number) {
        setSurahNumber(bookmark.surah_number);
      }
      return;
    }

    const target = document.getElementById(`reader-ayah-${surah.number}-${bookmark.ayah_number}`);
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const pageTitle = surah ? `${surah.name_english} · ${surah.name_arabic}` : i18n.navSurahs;

  const bookmarkKey = useMemo(() => {
    if (!bookmark) return null;
    return `${bookmark.surah_number}:${bookmark.ayah_number}`;
  }, [bookmark]);

  if (loading && !surah) {
    return (
      <div className="flex items-center justify-center h-full" style={{ background: t.pageBg }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: t.gold }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: t.pageBg, backgroundImage: t.pageBgPattern, backgroundSize: "48px 48px" }}>
      <div className="flex-shrink-0 px-5 pt-5 pb-4 relative overflow-hidden" style={{ background: t.headerBg, boxShadow: "0 4px 20px rgba(0,0,0,0.35)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: t.pageBgPattern, backgroundSize: "48px 48px" }} />
        <div className="relative z-10 flex justify-center">
          <div className="text-center" dir="rtl" style={{ width: "100%", maxWidth: "720px", margin: "0 auto" }}>
            <p className="font-amiri" style={{ fontSize: "22px", color: t.goldLight }}>المصحف</p>
            <p className="font-inter font-bold" style={{ fontSize: "15px", color: t.textOnDark, marginTop: "2px" }}>Quran Reader</p>
            <p className="font-inter" style={{ fontSize: "11px", color: t.headerSubtext, marginTop: "4px" }}>{pageTitle}</p>
          </div>
        </div>

        <div className="relative z-10 mt-4 flex items-center gap-3">
          <select
            value={surahNumber}
            onChange={(e) => setSurahNumber(parseInt(e.target.value, 10))}
            className="flex-1 rounded-xl px-4 py-3 font-inter text-sm outline-none"
            style={{
              background: "rgba(0,0,0,0.22)",
              border: `1px solid ${t.cardBorder}`,
              color: t.textOnDark,
            }}
          >
            {surahs.map((item) => (
              <option key={item.number} value={item.number} style={{ color: "#111" }}>
                {item.number}. {item.name_english}
              </option>
            ))}
          </select>

          <button
            onClick={jumpToBookmark}
            disabled={!bookmark}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all disabled:opacity-40"
            title="Go to marker"
            style={{
              background: bookmark ? "rgba(212, 175, 55, 0.12)" : "rgba(212, 175, 55, 0.08)",
              border: `1px solid ${bookmark ? "rgba(212, 175, 55, 0.28)" : "rgba(212, 175, 55, 0.18)"}`,
              boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
            }}
          >
            <MapPinned className="w-4.5 h-4.5" style={{ color: t.gold }} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div
          className="rounded-[28px] px-5 py-6 relative overflow-hidden"
          style={{
            background: t.cardBg,
            border: `1px solid ${t.cardBorder}`,
            boxShadow: t.cardShadow,
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="text-center w-full">
              <p className="font-amiri" style={{ fontSize: "28px", color: t.gold }}>{surah?.name_arabic}</p>
              <p className="font-inter" style={{ fontSize: "12px", color: t.textMuted }}>{surah?.name_english}</p>
            </div>
          </div>

          {bookmark ? (
            <div className="flex justify-center mb-5">
              <div
                className="rounded-full px-3 py-1.5 font-inter"
                style={{
                  background: "rgba(212,175,55,0.10)",
                  border: "1px solid rgba(212,175,55,0.25)",
                  color: t.gold,
                  fontSize: "11px",
                }}
              >
                Marked {bookmark.surah_number}:{bookmark.ayah_number}
              </div>
            </div>
          ) : null}

          <div className="flex justify-center">
            <div
              dir="rtl"
              className="font-amiri text-center"
              style={{
                fontSize: "clamp(1.9rem, 3.1vw, 2.55rem)",
                lineHeight: 2.35,
                color: "#234030",
                wordSpacing: "0.08em",
                maxWidth: "820px",
                width: "100%",
                margin: "0 auto",
              }}
            >
              {surah?.verses?.map((verse) => {
                const isBookmarked = bookmarkKey === `${surah.number}:${verse.number}`;
                const sajdaLabel = getSajdaLabel(verse.sajda);

                return (
                  <span key={`${surah.number}-${verse.number}`} id={`reader-ayah-${surah.number}-${verse.number}`} className="inline">
                    <span>{verse.arabic}</span>
                    <motion.button
                      onClick={() => toggleBookmark(verse)}
                      disabled={savingBookmark}
                      className="inline-flex items-center justify-center align-middle mx-1.5 rounded-full"
                      animate={justMarkedAyah === `${surah.number}:${verse.number}` ? { scale: [1, 1.22, 1], boxShadow: ["0 0 0 rgba(212,175,55,0)", "0 0 18px rgba(212,175,55,0.55)", "0 0 0 rgba(212,175,55,0)"] } : { scale: 1, boxShadow: isBookmarked ? t.goldShadow : "none" }}
                      transition={{ duration: 0.55, ease: "easeOut" }}
                      style={{
                        width: "1.95rem",
                        height: "1.95rem",
                        background: isBookmarked ? t.goldGradient : "rgba(212,175,55,0.12)",
                        border: `1px solid ${isBookmarked ? t.goldDark : "rgba(212,175,55,0.22)"}`,
                        verticalAlign: "middle",
                      }}
                      title={`Mark verse ${verse.number}`}
                    >
                      <span
                        className="font-inter font-bold"
                        style={{
                          fontSize: "0.78rem",
                          color: isBookmarked ? "#2B241B" : t.gold,
                          lineHeight: 1,
                        }}
                      >
                        {verse.number}
                      </span>
                    </motion.button>
                    {sajdaLabel ? (
                      <span
                        className="inline-flex items-center align-middle mx-1 rounded-full px-2 py-0.5 font-inter"
                        style={{
                          fontSize: "0.72rem",
                          color: t.gold,
                          background: "rgba(212,175,55,0.10)",
                          border: "1px solid rgba(212,175,55,0.22)",
                          verticalAlign: "middle",
                        }}
                      >
                        {sajdaLabel}
                      </span>
                    ) : null}
                    <span>{" "}</span>
                  </span>
                );
              })}
            </div>
          </div>

          {settings.display_language !== "ar" && surah?.verses?.some((v) => v.translation) ? (
            <div className="mt-8 space-y-4">
              <div style={{ height: "1px", background: `linear-gradient(to right, transparent, ${t.cardBorder}, transparent)` }} />
              {surah.verses.map((verse) => (
                <div key={`tr-${surah.number}-${verse.number}`} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center font-inter font-bold"
                      style={{ background: "rgba(212,175,55,0.12)", color: t.gold, fontSize: "11px" }}
                    >
                      {verse.number}
                    </span>
                    {verse.sajda ? (
                      <span className="font-inter" style={{ color: t.gold, fontSize: "11px" }}>{getSajdaLabel(verse.sajda)}</span>
                    ) : null}
                  </div>
                  <p className="font-inter" style={{ fontSize: "14px", lineHeight: 1.8, color: t.textMuted }}>
                    {verse.translation}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}