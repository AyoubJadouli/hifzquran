import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeColors } from "../useThemeColors";

// arabesque defined per theme in component body

function GoldArrowButton({ onClick, disabled, direction }) {
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      disabled={disabled}
      className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-20 flex-shrink-0 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #E7C86A 0%, #D8B24A 35%, #C9971E 70%, #A07A18 100%)",
        boxShadow:
          "0 3px 10px rgba(0,0,0,0.45), inset 0 1px 1.5px rgba(255,255,255,0.22), 0 0 0 1px #8B6A1F",
      }}
    >
      {/* Shine */}
      <div
        className="absolute top-0 left-0 right-0 rounded-t-full pointer-events-none"
        style={{
          height: "45%",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)",
        }}
      />
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        {direction === "left" ? (
          <path
            d="M8 2L4 6.5L8 11"
            stroke="#F8F3E8"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M5 2L9 6.5L5 11"
            stroke="#F8F3E8"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </motion.button>
  );
}

export default function ChunkHeader({
  surahNameArabic,
  surahNameEnglish,
  startVerse,
  endVerse,
  currentChunkIndex,
  totalChunks,
  onPrev,
  onNext,
}) {
  const { useThemeColors: _utc, ...rest } = {}; // suppress lint
  const t = useThemeColors();
  return (
    <div
      className="relative flex-shrink-0"
      style={{
        background: t.headerBg,
        boxShadow: "0 4px 20px rgba(0,0,0,0.38)",
      }}
    >
      {/* Arabesque overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: t.pageBgPattern, backgroundSize: "40px 40px" }}
      />
      {/* Radial center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(23,120,76,0.4) 0%, transparent 65%)",
        }}
      />

      <div className="relative px-4 pt-3 pb-0">
        <div className="flex items-center justify-between">
          {/* Prev arrow */}
          <GoldArrowButton
            onClick={onPrev}
            disabled={currentChunkIndex <= 0}
            direction="left"
          />

          {/* Center surah info */}
          <div className="flex-1 text-center px-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${surahNameArabic}-${startVerse}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <p
                  className="font-amiri leading-tight"
                  style={{
                    fontSize: "22px",
                    color: "#F5EDD0",
                    textShadow: "0 1px 5px rgba(0,0,0,0.55)",
                  }}
                >
                  {surahNameArabic}
                </p>
                <p
                  className="font-inter font-semibold"
                  style={{
                    fontSize: "13px",
                    color: "#F0E6C8",
                    textShadow: "0 1px 3px rgba(0,0,0,0.45)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {surahNameEnglish}
                </p>
                <p
                  className="font-inter"
                  style={{
                    fontSize: "11px",
                    color: "rgba(240,230,200,0.68)",
                    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                  }}
                >
                  Verses {startVerse}–{endVerse}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next arrow */}
          <GoldArrowButton
            onClick={onNext}
            disabled={currentChunkIndex >= totalChunks - 1}
            direction="right"
          />
        </div>

        {/* Chunk position dots */}
        <div className="flex items-center justify-center gap-1.5 mt-2.5 mb-2.5">
          {totalChunks <= 20 ? (
            Array.from({ length: totalChunks }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: i === currentChunkIndex ? 1.25 : 1 }}
                transition={{ duration: 0.2 }}
                className="rounded-full"
                style={{
                  width: i === currentChunkIndex ? 9 : 7,
                  height: i === currentChunkIndex ? 9 : 7,
                  background:
                    i === currentChunkIndex
                      ? "linear-gradient(145deg, #F2D675 0%, #D4AF37 100%)"
                      : "rgba(212,175,55,0.30)",
                  boxShadow:
                    i === currentChunkIndex
                      ? "0 0 6px rgba(212,175,55,0.65), inset 0 1px 1px rgba(255,255,255,0.2)"
                      : "inset 0 1px 1px rgba(0,0,0,0.2)",
                  transition: "width 0.2s, height 0.2s",
                }}
              />
            ))
          ) : (
            <span
              className="text-xs font-inter font-semibold"
              style={{ color: "#D4AF37" }}
            >
              {currentChunkIndex + 1} / {totalChunks}
            </span>
          )}
        </div>
      </div>

      {/* Gold ornamental bottom border */}
      <div
        style={{
          height: "2px",
          background:
            "linear-gradient(to right, transparent, #F2D675 20%, #D4AF37 50%, #F2D675 80%, transparent)",
        }}
      />
    </div>
  );
}