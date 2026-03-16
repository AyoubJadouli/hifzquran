import React, { useState } from "react";
import { ChevronDown, Search, BookOpen } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { fetchSurahList } from "../quranData";

export default function SurahSelector({ currentSurah, onSelectSurah }) {
  const [open, setOpen] = useState(false);
  const [surahs, setSurahs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleOpen() {
    setOpen(true);
    if (surahs.length === 0) {
      setLoading(true);
      const list = await fetchSurahList();
      setSurahs(list);
      setLoading(false);
    }
  }

  const filtered = surahs.filter(
    (s) =>
      !search ||
      s.name_english.toLowerCase().includes(search.toLowerCase()) ||
      s.name_arabic.includes(search) ||
      String(s.number).includes(search)
  );

  return (
    <>
      <div className="px-4 mb-2">
        <button
          onClick={handleOpen}
          className="w-full flex items-center gap-2.5 px-5 py-2.5 rounded-full relative overflow-hidden active:opacity-80 transition-opacity"
          style={{
            background:
              "linear-gradient(160deg, #0C5A39 0%, #0E6A43 50%, #0A4D31 100%)",
            border: "1.5px solid #D4AF37",
            boxShadow:
              "0 3px 18px rgba(10,78,49,0.45), inset 0 1px 1px rgba(255,255,255,0.07)",
          }}
        >
          {/* Top highlight shine */}
          <div
            className="absolute top-0 left-0 right-0 rounded-t-full pointer-events-none"
            style={{
              height: "42%",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)",
            }}
          />
          <BookOpen className="w-4 h-4 flex-shrink-0" style={{ color: "#D4AF37" }} />
          <span
            className="flex-1 text-left font-inter font-medium truncate text-sm"
            style={{ color: "#F0E6C8" }}
          >
            {currentSurah
              ? `${currentSurah.name_english} (${currentSurah.number}) · ${currentSurah.total_verses} verses · ${currentSurah.revelation_type}`
              : "Select Surah"}
          </span>
          <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: "#D4AF37" }} />
        </button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl bg-background p-0 flex flex-col">
          <div className="px-5 pt-4 pb-3 flex-shrink-0">
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search surahs..."
                className="pl-9 bg-card font-inter"
                autoFocus
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-[#0D5C46]/20 border-t-[#0D5C46] rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-0.5">
                {filtered.map((surah) => {
                  const isSelected = currentSurah?.number === surah.number;
                  return (
                    <button
                      key={surah.number}
                      onClick={() => {
                        onSelectSurah(surah.number);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors ${
                        isSelected ? "bg-[#0D5C46] text-white" : "hover:bg-muted"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold font-inter flex-shrink-0 ${
                          isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {surah.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-sm font-inter font-medium truncate ${isSelected ? "text-white" : "text-foreground"}`}>
                            {surah.name_english}
                          </span>
                          <span className={`font-amiri text-base flex-shrink-0 ${isSelected ? "text-white" : "text-foreground"}`}>
                            {surah.name_arabic}
                          </span>
                        </div>
                        <span className={`text-xs font-inter ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>
                          {surah.total_verses} verses · {surah.revelation_type}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}