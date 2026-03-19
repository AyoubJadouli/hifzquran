import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeColors } from "../useThemeColors";

const arabesque = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M20 2 L22 18 L38 20 L22 22 L20 38 L18 22 L2 20 L18 18 Z' fill='%23F2D675' fill-opacity='0.9'/%3E%3C/svg%3E")`;

function GoldSeparator() {
  return (
    <div className="flex items-center justify-center gap-2 my-2.5">
      <div style={{ height: "1.5px", width: "64px", background: "linear-gradient(to right, transparent, #D4AF37)" }} />
      <span style={{ color: "#F2D675", fontSize: "9px" }}>✦</span>
      <div style={{ height: "1.5px", width: "64px", background: "linear-gradient(to left, transparent, #D4AF37)" }} />
    </div>
  );
}

function ActiveVerseCard({ verse }) {
  const t = useThemeColors();
  if (!verse) return null;
  return (
    <div
      className="mx-3 h-full relative"
      style={{ filter: "drop-shadow(0 0 18px rgba(212,175,55,0.28))" }}
    >
      {/* Outer gold gradient border */}
      <div
        className="w-full h-full rounded-[22px] p-[2.5px] relative"
        style={{
          background: "linear-gradient(145deg, #F2D675 0%, #D4AF37 30%, #8B6A1F 65%, #D4AF37 100%)",
          boxShadow:
            "0 0 0 1px rgba(242,214,117,0.35), 0 10px 40px rgba(10,78,49,0.55), 0 4px 16px rgba(0,0,0,0.25)",
        }}
      >
        {/* Inner card — theme-aware */}
        <div
          className="w-full h-full rounded-[19px] overflow-hidden flex flex-col items-center justify-center px-5 py-4 relative"
          style={{ background: t.activeCardBg }}
        >
          {/* Arabesque pattern overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: arabesque, backgroundSize: "40px 40px", opacity: 0.035 }}
          />
          {/* Radial center glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, rgba(23,120,76,0.28) 0%, transparent 65%)",
            }}
          />

          {/* Corner gold sparkle ornaments */}
          {["top-2 left-3", "top-2 right-3", "bottom-2 left-3", "bottom-2 right-3"].map((pos) => (
            <span
              key={pos}
              className={`absolute ${pos} select-none pointer-events-none`}
              style={{ color: "#D4AF37", fontSize: "11px", opacity: 0.65 }}
            >
              ✦
            </span>
          ))}

          {/* Content */}
          <div className="relative z-10 text-center w-full">
            {/* Gold medallion verse badge */}
            <div className="flex justify-center mb-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(145deg, #F2D675 0%, #D4AF37 55%, #8B6A1F 100%)",
                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.45), inset 0 1px 2px rgba(255,255,255,0.25)",
                }}
              >
                <span
                  className="text-xs font-bold font-inter"
                  style={{ color: "#2B241B" }}
                >
                  {verse.number}
                </span>
              </div>
            </div>

            {/* Arabic text */}
            <p
              dir="rtl"
              className="font-amiri text-center leading-[2.05]"
              style={{ fontSize: "25px", color: "#F5EDD0" }}
            >
              {verse.arabic}
            </p>

            <GoldSeparator />

            {/* Translation */}
            {verse.translation && (
              <p
                className="font-inter text-center leading-relaxed"
                style={{ fontSize: "11.5px", color: "#EDE0C4", lineHeight: 1.65 }}
              >
                {verse.translation}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Side midpoint sparkle ornaments */}
      <span
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-0.5 select-none pointer-events-none"
        style={{ color: "#F2D675", fontSize: "9px", opacity: 0.8 }}
      >
        ✦
      </span>
      <span
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-0.5 select-none pointer-events-none"
        style={{ color: "#F2D675", fontSize: "9px", opacity: 0.8 }}
      >
        ✦
      </span>
    </div>
  );
}

function PreviewVerseCard({ verse, onClick }) {
  const t = useThemeColors();
  if (!verse)
    return <div className="flex-shrink-0" style={{ height: "72px" }} />;
  return (
    <div
      onClick={onClick}
      className={`mx-4 rounded-2xl px-4 py-2.5 relative overflow-hidden flex-shrink-0 ${
        onClick ? "cursor-pointer active:opacity-75 transition-opacity" : ""
      }`}
      style={{
        height: "72px",
        background: t.previewCardBg,
        border: `1px solid ${t.previewCardBorder}`,
        boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
      }}
    >
      {/* Micro corner ornaments */}
      <span className="absolute top-1 left-2 text-[7px] select-none" style={{ color: "#C8B48A", opacity: 0.55 }}>◆</span>
      <span className="absolute top-1 right-2 text-[7px] select-none" style={{ color: "#C8B48A", opacity: 0.55 }}>◆</span>

      <div className="flex items-center gap-2.5 h-full">
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "#E8DDC7", border: "1px solid #C8B48A" }}
        >
          <span className="font-bold font-inter" style={{ fontSize: "8px", color: "#6E6252" }}>
            {verse.number}
          </span>
        </div>
        <div className="flex-1 min-w-0 text-center">
          {/* Arabic only — spec: no translation on preview cards */}
          <p
            dir="rtl"
            className="font-amiri leading-tight"
            style={{ fontSize: "16px", color: t.previewCardText, opacity: 0.72 }}
          >
            {verse.arabic}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LuxuryVerseStack({
  verses,
  currentVerseIndex,
  onVerseChange,
  isPlaying,
}) {
  const touchStartY = useRef(0);

  const prevVerse = verses[currentVerseIndex - 1] ?? null;
  const currentVerse = verses[currentVerseIndex];
  const nextVerse = verses[currentVerseIndex + 1] ?? null;

  const canPrev = currentVerseIndex > 0 && !isPlaying;
  const canNext = currentVerseIndex < verses.length - 1 && !isPlaying;

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e) => {
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && canNext) onVerseChange(currentVerseIndex + 1);
      else if (diff < 0 && canPrev) onVerseChange(currentVerseIndex - 1);
    }
  };

  return (
    <div
      className="flex flex-col flex-1 overflow-hidden gap-2 py-2"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Previous verse preview */}
      <PreviewVerseCard
        verse={prevVerse}
        onClick={canPrev ? () => onVerseChange(currentVerseIndex - 1) : null}
      />

      {/* Current active verse (flex-1) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentVerseIndex}
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -28 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="flex-1"
        >
          <ActiveVerseCard verse={currentVerse} />
        </motion.div>
      </AnimatePresence>

      {/* Next verse preview */}
      <PreviewVerseCard
        verse={nextVerse}
        onClick={canNext ? () => onVerseChange(currentVerseIndex + 1) : null}
      />
    </div>
  );
}