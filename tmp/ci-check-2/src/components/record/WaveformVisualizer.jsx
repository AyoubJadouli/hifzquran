import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const BAR_COUNT = 32;

export default function WaveformVisualizer({ stream, isRecording, verseElapsed }) {
  const [bars, setBars] = useState(Array(BAR_COUNT).fill(4));
  const rafRef = useRef(null);
  const ctxRef = useRef(null);
  const fallbackRef = useRef(null);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    clearInterval(fallbackRef.current);
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;

    if (!stream || !isRecording) {
      setBars(Array(BAR_COUNT).fill(4));
      return;
    }

    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctxRef.current = ctx;
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.75;
      src.connect(analyser);
      const buf = analyser.frequencyBinCount;
      const data = new Uint8Array(buf);

      const draw = () => {
        rafRef.current = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(data);
        setBars(
          Array(BAR_COUNT).fill(0).map((_, i) => {
            const idx = Math.floor((i / BAR_COUNT) * buf);
            return Math.max(4, Math.min(46, (data[idx] / 255) * 46 + 2));
          })
        );
      };
      draw();
    } catch {
      fallbackRef.current = setInterval(() => {
        setBars(Array(BAR_COUNT).fill(0).map((_, i) => {
          const center = BAR_COUNT / 2;
          const dist = Math.abs(i - center) / center;
          return Math.random() * 36 * (1 - dist * 0.35) + 4;
        }));
      }, 80);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(fallbackRef.current);
      ctxRef.current?.close().catch(() => {});
    };
  }, [stream, isRecording]);

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div
      className="flex flex-col items-center gap-2 px-5 py-3 flex-shrink-0 relative"
      style={{
        background: "linear-gradient(180deg, rgba(14,91,61,0) 0%, rgba(10,65,43,0.55) 100%)",
        borderTop: "1px solid rgba(212,175,55,0.2)",
      }}
    >
      {/* Waveform bars */}
      <div className="flex items-end gap-[3px]" style={{ height: "46px" }}>
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="w-[5px] rounded-full"
            animate={{ height: isRecording ? `${h}px` : "4px" }}
            transition={{ duration: 0.08 }}
            style={{
              background: isRecording
                ? "linear-gradient(180deg, #E8C858 0%, #C9971E 55%, #926C1E 100%)"
                : "rgba(212,175,55,0.2)",
              boxShadow: isRecording ? "0 0 3px rgba(232,200,88,0.35)" : "none",
            }}
          />
        ))}
      </div>
      {/* Verse timer */}
      <span
        className="font-mono font-semibold"
        style={{ fontSize: "12px", color: "#C9971E", letterSpacing: "0.05em" }}
      >
        {fmt(verseElapsed)}
      </span>
    </div>
  );
}