import React from "react";
import { motion } from "framer-motion";

export default function VerseCard({ 
  verse, 
  isCurrent, 
  showTranslation, 
  showArabic = true, 
  verseIndex,
  totalVerses 
}) {
  return (
    <motion.div
      animate={{
        scale: isCurrent ? 1 : 0.88,
        opacity: isCurrent ? 1 : 0.4,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="px-5 py-4"
    >
      <div
        className={`rounded-2xl p-6 transition-all duration-300 ${
          isCurrent
            ? "bg-card shadow-lg shadow-[#0D5C46]/5 border border-[#0D5C46]/10"
            : "bg-card/50"
        }`}
      >
        {/* Verse number badge */}
        {isCurrent && (
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0D5C46]/10 text-[#0D5C46] font-inter text-sm font-semibold">
              {verse.number}
            </span>
          </div>
        )}

        {/* Arabic text */}
        {showArabic && (
          <p
            dir="rtl"
            className={`font-amiri text-center leading-loose text-gray-900 ${
              isCurrent ? "text-[26px] leading-[2.2]" : "text-xl"
            }`}
          >
            {verse.arabic}
          </p>
        )}

        {/* Translation - only for current */}
        {isCurrent && showTranslation && verse.translation && (
          <>
            <div className="w-16 h-px bg-[#D4AF37]/40 mx-auto my-4" />
            <p className="text-sm text-gray-500 font-inter text-center leading-relaxed italic">
              {verse.translation}
            </p>
          </>
        )}

        {/* Verse counter for current */}
        {isCurrent && (
          <p className="text-[10px] text-gray-400 font-inter text-center mt-3">
            {verseIndex + 1} of {totalVerses}
          </p>
        )}
      </div>
    </motion.div>
  );
}