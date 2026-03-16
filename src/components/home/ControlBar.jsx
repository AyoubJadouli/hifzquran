import React from "react";
import { Mic, Play, Pause, Square, MoreVertical, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ControlBar({
  playbackState,
  hasRecording,
  selectedRecordingName,
  selectedRecordingDuration,
  onRecord,
  onPlay,
  onPause,
  onResume,
  onStop,
  onMenu,
}) {
  const isIdle = playbackState === "idle";
  const isPlaying = playbackState === "playing";
  const isPaused = playbackState === "paused";
  const isActive = isPlaying || isPaused;

  return (
    <div className="bg-card border-t border-border px-4 py-3 flex-shrink-0">
      <div className="flex items-center justify-center gap-3">
        {/* Record */}
        <motion.button whileTap={{ scale: 0.9 }} onClick={onRecord} className="flex flex-col items-center gap-0.5">
          <div className="w-14 h-14 rounded-full bg-[#0D5C46] flex items-center justify-center shadow-lg shadow-[#0D5C46]/25">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <span className="text-[10px] font-inter text-muted-foreground">Record</span>
        </motion.button>

        {/* Pause / Resume (active only) */}
        <AnimatePresence>
          {isActive && (
            <motion.button
              key="pause-resume"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={isPlaying ? onPause : onResume}
              className="flex flex-col items-center gap-0.5"
            >
              <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-lg shadow-[#D4AF37]/25">
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" fill="white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                )}
              </div>
              <span className="text-[10px] font-inter text-muted-foreground">
                {isPlaying ? "Pause" : "Resume"}
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Play / Stop */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={isActive ? onStop : onPlay}
          disabled={isIdle && !hasRecording}
          className="flex flex-col items-center gap-0.5"
        >
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${
              isActive
                ? "bg-red-500 shadow-red-500/25"
                : hasRecording
                ? "bg-emerald-500 shadow-emerald-500/25"
                : "bg-muted shadow-none"
            }`}
          >
            {isActive ? (
              <Square className="w-5 h-5 text-white" fill="white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
            )}
          </div>
          <span className="text-[10px] font-inter text-muted-foreground">
            {isActive ? "Stop" : "Play"}
          </span>
        </motion.button>

        {/* Menu */}
        <motion.button whileTap={{ scale: 0.9 }} onClick={onMenu} className="flex flex-col items-center gap-0.5 ml-1">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="text-[10px] font-inter text-muted-foreground">Options</span>
        </motion.button>
      </div>

      {/* Recording label */}
      <div className="mt-2 text-center h-4">
        {selectedRecordingName ? (
          <div className="flex items-center justify-center gap-1.5">
            <Music className="w-3 h-3 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground font-inter truncate max-w-[200px]">
              {selectedRecordingName}
              {selectedRecordingDuration ? ` · ${selectedRecordingDuration}` : ""}
            </span>
          </div>
        ) : (
          <p className="text-[11px] text-muted-foreground font-inter">
            {hasRecording ? "No recording selected" : "Tap 🎤 to create a recording"}
          </p>
        )}
      </div>
    </div>
  );
}