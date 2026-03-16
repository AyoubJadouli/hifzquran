import React from "react";

export default function VerseProgressTrack({ total, recordedCount, currentIndex }) {
  return (
    <div
      className="px-4 py-2.5 flex-shrink-0 flex items-center gap-3"
      style={{ background: "transparent" }}
    >
      {/* Progress blocks */}
      <div className="flex gap-[5px] flex-1 justify-center">
        {Array.from({ length: total }).map((_, i) => {
          const isDone = i < recordedCount;
          const isCurrent = i === currentIndex;
          return (
            <div
              key={i}
              className="flex-1 rounded-[5px] relative overflow-hidden"
              style={{
                height: "15px",
                maxWidth: "44px",
                background: isDone || isCurrent
                  ? "linear-gradient(180deg, #F1D36E 0%, #D4AF37 55%, #9C7420 100%)"
                  : "linear-gradient(180deg, #FBF7EE 0%, #E5DBC8 100%)",
                border: isDone || isCurrent
                  ? "1px solid #8B641B"
                  : "1px solid #C8BBA4",
                boxShadow: isDone || isCurrent
                  ? "0 2px 6px rgba(156,116,32,0.45), inset 0 1px 1px rgba(255,255,255,0.25)"
                  : "inset 0 1px 2px rgba(0,0,0,0.08)",
              }}
            >
              {/* Top shine on filled */}
              {(isDone || isCurrent) && (
                <div
                  className="absolute top-0 left-0 right-0 pointer-events-none rounded-t-[4px]"
                  style={{
                    height: "45%",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)",
                  }}
                />
              )}
              {/* Pulsing dot for current */}
              {isCurrent && !isDone && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#FFF9F0", boxShadow: "0 0 4px rgba(255,249,240,0.8)" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}