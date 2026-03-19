import React from "react";
import { SkipBack, SkipForward } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PlaybackStatusBar({
  visible,
  isPlaying,
  speed,
  verseRep,
  verseRepTotal,
  chunkRep,
  chunkRepTotal,
  onPrevVerse,
  onNextVerse,
  canPrevVerse,
  canNextVerse,
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="overflow-hidden bg-card border-t border-border flex-shrink-0"
        >
          <div className="px-4 py-2.5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: isPlaying ? 1.5 : 3 }}
                  className={`w-2 h-2 rounded-full ${isPlaying ? "bg-emerald-500" : "bg-[#D4AF37]"}`}
                />
                <span className="text-xs font-inter font-semibold text-foreground">
                  {isPlaying ? "Playing" : "Paused"}
                </span>
                <span className="text-xs text-muted-foreground">· {speed}x</span>
                <span className="text-xs text-muted-foreground">
                  · Rep {verseRep}/{verseRepTotal}
                </span>
                <span className="text-xs text-muted-foreground">
                  · Loop {chunkRep}/{chunkRepTotal === 0 ? "∞" : chunkRepTotal}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-10">
              <button
                onClick={onPrevVerse}
                disabled={!canPrevVerse}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-25 transition-colors font-inter"
              >
                <SkipBack className="w-4 h-4" />
                prev verse
              </button>
              <button
                onClick={onNextVerse}
                disabled={!canNextVerse}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-25 transition-colors font-inter"
              >
                next verse
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}