import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeColors } from "../useThemeColors";
import { Mic, Play, Pause, Square, MoreVertical, Music } from "lucide-react";

const goldGradient =
  "linear-gradient(160deg, #E7C86A 0%, #D8B24A 30%, #C9971E 70%, #A07A18 100%)";
const goldShadow =
  "0 4px 14px rgba(139,106,31,0.45), inset 0 1px 1.5px rgba(255,255,255,0.22), 0 0 0 1.5px #8B6A1F";
const greenGradient =
  "linear-gradient(160deg, #2B8A3E 0%, #1E7A34 40%, #136228 100%)";
const greenShadow =
  "0 4px 18px rgba(10,78,49,0.55), 0 0 0 1.5px #D4AF37, inset 0 1px 1.5px rgba(255,255,255,0.15)";

function PremiumButton({ onClick, disabled, gradient, shadow, children }) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      disabled={disabled}
      className="relative flex flex-col items-center justify-center gap-1 rounded-[18px] overflow-hidden disabled:opacity-35"
      style={{
        background: gradient,
        boxShadow: shadow,
        minWidth: "76px",
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingLeft: "14px",
        paddingRight: "14px",
      }}
    >
      {/* Top shine */}
      <div
        className="absolute top-0 left-0 right-0 rounded-t-[18px] pointer-events-none"
        style={{
          height: "42%",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.13) 0%, transparent 100%)",
        }}
      />
      {children}
    </motion.button>
  );
}

export default function LuxuryControlBar({
  // theme-aware
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
  const t = useThemeColors();
  const isIdle = playbackState === "idle";
  const isPlaying = playbackState === "playing";
  const isActive = isPlaying || playbackState === "paused";

  const redGradient = "linear-gradient(160deg, #E53E3E 0%, #C53030 100%)";
  const redShadow = "0 4px 14px rgba(197,48,48,0.5), inset 0 1px 1px rgba(255,255,255,0.1)";

  return (
    <div
      className="flex-shrink-0"
      style={{
        background: t.controlBg,
        boxShadow: t.controlBgShadow,
      }}
    >
      {/* Gold top ornamental border */}
      <div
        style={{
          height: "1.5px",
          background:
            "linear-gradient(to right, transparent, #F2D675 20%, #D4AF37 50%, #F2D675 80%, transparent)",
        }}
      />

      {/* Buttons row */}
      <div className="flex items-center justify-center gap-3 px-4 pt-3 pb-2">
        {/* Record */}
        <PremiumButton onClick={onRecord} gradient={goldGradient} shadow={goldShadow}>
          <Mic className="w-5 h-5" style={{ color: "#2B241B" }} />
          <span className="text-[10px] font-inter font-bold" style={{ color: "#2B241B" }}>
            Record
          </span>
        </PremiumButton>

        {/* Pause / Resume — visible only when active */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              key="pause-resume"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.14 }}
            >
              <PremiumButton
                onClick={isPlaying ? onPause : onResume}
                gradient={goldGradient}
                shadow={goldShadow}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" style={{ color: "#2B241B" }} fill="#2B241B" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" style={{ color: "#2B241B" }} fill="#2B241B" />
                )}
                <span className="text-[10px] font-inter font-bold" style={{ color: "#2B241B" }}>
                  {isPlaying ? "Pause" : "Resume"}
                </span>
              </PremiumButton>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Play / Stop */}
        <PremiumButton
          onClick={isActive ? onStop : onPlay}
          disabled={isIdle && !hasRecording}
          gradient={isActive ? redGradient : greenGradient}
          shadow={isActive ? redShadow : greenShadow}
        >
          {isActive ? (
            <Square className="w-5 h-5 text-white" fill="white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
          )}
          <span className="text-[10px] font-inter font-bold text-white">
            {isActive ? "Stop" : "Play"}
          </span>
        </PremiumButton>

        {/* Menu */}
        <PremiumButton onClick={onMenu} gradient={goldGradient} shadow={goldShadow}>
          <MoreVertical className="w-5 h-5" style={{ color: "#2B241B" }} />
          <span className="text-[10px] font-inter font-bold" style={{ color: "#2B241B" }}>
            Menu
          </span>
        </PremiumButton>
      </div>

      {/* Recording info strip */}
      <div className="flex items-center justify-center gap-2 pb-3 px-5">
        <div
          className="flex-1 h-px"
          style={{
            background: "linear-gradient(to right, transparent, rgba(212,175,55,0.38))",
          }}
        />
        {selectedRecordingName ? (
          <div className="flex items-center gap-1.5">
            <Music className="w-3 h-3" style={{ color: "#D4AF37" }} />
            <span
              className="text-[11px] font-inter"
              style={{ color: "#D4AF37", letterSpacing: "0.01em" }}
            >
              {selectedRecordingName}
              {selectedRecordingDuration ? ` · ${selectedRecordingDuration}` : ""}
            </span>
          </div>
        ) : (
          <span
            className="text-[11px] font-inter"
            style={{ color: "rgba(212,175,55,0.48)" }}
          >
            Tap Record to add a recitation
          </span>
        )}
        <div
          className="flex-1 h-px"
          style={{
            background: "linear-gradient(to left, transparent, rgba(212,175,55,0.38))",
          }}
        />
      </div>
    </div>
  );
}