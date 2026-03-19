import React from "react";
import { Mic, Play, Square, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";

export default function PlaybackControls({ 
  isPlaying, 
  hasRecording, 
  onRecord, 
  onPlay, 
  onStop, 
  onOpenMenu 
}) {
  return (
    <div className="bg-card border-t border-border px-6 py-4">
      <div className="flex items-center justify-center gap-6 max-w-sm mx-auto">
        {/* Record button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onRecord}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-14 h-14 rounded-full bg-[#0D5C46] flex items-center justify-center shadow-lg shadow-[#0D5C46]/20">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <span className="text-[10px] font-inter font-medium text-gray-500">Record</span>
        </motion.button>

        {/* Play/Stop button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={isPlaying ? onStop : onPlay}
          disabled={!hasRecording && !isPlaying}
          className="flex flex-col items-center gap-1"
        >
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${
              isPlaying
                ? "bg-red-500 shadow-red-500/20"
                : hasRecording
                ? "bg-[#D4AF37] shadow-[#D4AF37]/20"
                : "bg-gray-200 shadow-none"
            }`}
          >
            {isPlaying ? (
              <Square className="w-5 h-5 text-white" fill="white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
            )}
          </div>
          <span className="text-[10px] font-inter font-medium text-gray-500">
            {isPlaying ? "Stop" : "Play"}
          </span>
        </motion.button>

        {/* Menu button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onOpenMenu}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mt-1">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </div>
          <span className="text-[10px] font-inter font-medium text-gray-500 mt-0.5">Options</span>
        </motion.button>
      </div>

      {/* Playing indicator */}
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <div className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scaleY: [1, 1.8, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                  className="w-0.5 h-3 bg-[#0D5C46] rounded-full"
                />
              ))}
            </div>
            <span className="text-xs text-[#0D5C46] font-inter font-medium">Playing...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}