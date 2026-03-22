import React from "react";

function getContent(verse, language = "en") {
  const showTransliteration = language && language !== "ar";
  return showTransliteration
    ? (verse.transliteration || verse.arabic || "")
    : (verse.arabic || verse.transliteration || "");
}

function getMaxFontSize(verseCount) {
  if (verseCount <= 3) return "clamp(1.9rem, 4vw, 2.8rem)";
  if (verseCount <= 6) return "clamp(1.5rem, 3vw, 2.2rem)";
  return "clamp(1.2rem, 2.4vw, 1.8rem)";
}

export default function FullChunkView({ verses, language = "en", currentVerseIndex = -1 }) {
  const isArabic = language === "ar";
  const fontSize = getMaxFontSize(verses?.length || 0);

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4">
      <div
        className="min-h-full rounded-[28px] border border-[#D4AF3760] bg-[linear-gradient(180deg,rgba(14,91,61,0.96),rgba(10,65,43,0.98))] shadow-[0_10px_40px_rgba(0,0,0,0.35)] px-5 py-6 flex items-center justify-center"
      >
        <div className="w-full max-w-5xl text-center">
          <div
            dir={isArabic ? "rtl" : "ltr"}
            className={isArabic ? "font-amiri" : "font-inter"}
            style={{
              fontSize,
              lineHeight: isArabic ? 2.05 : 1.95,
              color: "#F8F3E8",
              whiteSpace: "pre-wrap",
              wordBreak: isArabic ? "normal" : "break-word",
              textShadow: "0 2px 14px rgba(0,0,0,0.28)",
            }}
          >
            {verses?.map((verse, index) => {
              const content = getContent(verse, language);
              const isCurrent = index === currentVerseIndex;
              return (
                <span
                  key={`full-verse-${verse.number}`}
                  className="inline-block mx-1 my-1 rounded-2xl px-3 py-1.5 transition-all"
                  style={{
                    background: isCurrent ? "rgba(212,175,55,0.18)" : "transparent",
                    border: isCurrent ? "1px solid rgba(242,214,117,0.75)" : "1px solid transparent",
                    boxShadow: isCurrent ? "0 0 0 1px rgba(139,106,31,0.25), 0 8px 24px rgba(212,175,55,0.18)" : "none",
                  }}
                >
                  <span style={{ color: isCurrent ? "#FFF4CC" : "#F8F3E8" }}>{content}</span>
                  <span style={{ color: isCurrent ? "#F2D675" : "#D4AF37", marginInlineStart: "0.45rem", fontSize: "0.7em", fontWeight: 700 }}>
                    ✦{verse.number}✦
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}