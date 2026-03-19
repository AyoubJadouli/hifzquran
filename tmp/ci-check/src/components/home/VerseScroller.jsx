import React, { useRef, useEffect } from "react";
import VerseCard from "./VerseCard";

export default function VerseScroller({ 
  verses, 
  currentVerseIndex, 
  onVerseChange, 
  showTranslation = true, 
  showArabic = true,
  isPlaying = false 
}) {
  const scrollRef = useRef(null);
  const verseRefs = useRef([]);

  useEffect(() => {
    if (verseRefs.current[currentVerseIndex]) {
      verseRefs.current[currentVerseIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentVerseIndex]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto scroll-smooth"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="py-8">
        {verses.map((verse, i) => (
          <div
            key={verse.number}
            ref={(el) => (verseRefs.current[i] = el)}
            onClick={() => !isPlaying && onVerseChange(i)}
            className="cursor-pointer"
          >
            <VerseCard
              verse={verse}
              isCurrent={i === currentVerseIndex}
              showTranslation={showTranslation}
              showArabic={showArabic}
              verseIndex={i}
              totalVerses={verses.length}
            />
          </div>
        ))}
      </div>
    </div>
  );
}