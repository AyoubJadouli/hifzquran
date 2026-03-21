import React, { useMemo } from "react";

function getDisplayText(verses, language = "en") {
  if (!verses?.length) return "";

  const showTransliteration = language && language !== "ar";
  const text = verses
    .map((verse) => {
      const content = showTransliteration ? (verse.transliteration || verse.arabic || "") : (verse.arabic || verse.transliteration || "");
      return content ? `${content} ✦${verse.number}✦` : "";
    })
    .filter(Boolean)
    .join(" ");

  return text;
}

function getFontSize(textLength) {
  if (textLength <= 120) return "clamp(2rem, 4.8vw, 3.5rem)";
  if (textLength <= 220) return "clamp(1.8rem, 4vw, 3rem)";
  if (textLength <= 360) return "clamp(1.5rem, 3.3vw, 2.4rem)";
  if (textLength <= 520) return "clamp(1.25rem, 2.7vw, 2rem)";
  return "clamp(1.05rem, 2.2vw, 1.65rem)";
}

export default function FullChunkView({ verses, language = "en" }) {
  const text = useMemo(() => getDisplayText(verses, language), [verses, language]);
  const isArabic = language === "ar";
  const fontSize = useMemo(() => getFontSize(text.length), [text.length]);

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4">
      <div
        className="min-h-full rounded-[28px] border border-[#D4AF3760] bg-[linear-gradient(180deg,rgba(14,91,61,0.96),rgba(10,65,43,0.98))] shadow-[0_10px_40px_rgba(0,0,0,0.35)] px-5 py-6 flex items-center justify-center"
      >
        <div className="w-full max-w-5xl text-center">
          <p
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
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}