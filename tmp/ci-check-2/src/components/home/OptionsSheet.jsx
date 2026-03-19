import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Switch } from "../ui/switch";
import { ListMusic, Zap, RotateCcw, Repeat, Timer, Shuffle, ChevronRight } from "lucide-react";

const SPEED_OPTIONS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
const VERSE_REP_OPTIONS = [1, 2, 3, 5, 10];
const CHUNK_REP_OPTIONS = [1, 2, 3, 5, 0]; // 0 = ∞
const GAP_OPTIONS = [0, 0.5, 1.0, 1.5, 2.0, 3.0, 5.0];

export default function OptionsSheet({
  open,
  onClose,
  recordings = [],
  selectedRecordingId,
  onSelectRecording,
  speed,
  onSpeedChange,
  verseRepetition,
  onVerseRepetitionChange,
  chunkRepetition,
  onChunkRepetitionChange,
  interVerseGap,
  onInterVerseGapChange,
  shuffleVerses,
  onShuffleVersesChange,
  autoAdvanceChunk,
  onAutoAdvanceChunkChange,
}) {
  function fmtMs(ms) {
    if (!ms) return "";
    const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000);
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-3xl bg-background max-h-[88vh] overflow-y-auto p-0">
        <div className="sticky top-0 bg-background px-5 pt-4 pb-2 z-10">
          <div className="w-10 h-1 bg-border rounded-full mx-auto mb-3" />
          <SheetHeader>
            <SheetTitle className="font-inter text-[#0D5C46] text-left text-base">Playback Options</SheetTitle>
          </SheetHeader>
        </div>

        <div className="px-5 pb-10 space-y-6">

          {/* Recording selector */}
          <Section icon={<ListMusic className="w-4 h-4" />} title="Select Recording">
            {recordings.length === 0 ? (
              <p className="text-sm text-muted-foreground font-inter italic py-2 text-center">
                No recordings yet — tap 🎤 Record to create one.
              </p>
            ) : (
              <div className="space-y-1.5">
                {recordings.map(rec => (
                  <button
                    key={rec.id}
                    onClick={() => onSelectRecording(rec.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all font-inter flex items-center justify-between ${
                      selectedRecordingId === rec.id
                        ? "bg-[#0D5C46] text-white"
                        : "bg-muted/60 text-foreground hover:bg-muted"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium">{rec.name}</p>
                      <p className={`text-xs mt-0.5 ${selectedRecordingId === rec.id ? "text-white/70" : "text-muted-foreground"}`}>
                        {rec.verse_files?.length || 0} verses · {fmtMs(rec.total_duration_ms) || "—"}
                      </p>
                    </div>
                    {selectedRecordingId === rec.id && (
                      <span className="text-white text-xs font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </Section>

          <Divider />

          {/* Speed */}
          <Section icon={<Zap className="w-4 h-4" />} title="Speed">
            <div className="flex gap-1.5 flex-wrap">
              {SPEED_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => onSpeedChange(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-inter font-semibold transition-all ${
                    speed === s
                      ? "bg-[#0D5C46] text-white shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </Section>

          <Divider />

          {/* Verse repeat */}
          <Section icon={<RotateCcw className="w-4 h-4" />} title="Verse Repeat">
            <div className="flex gap-1.5 flex-wrap">
              {VERSE_REP_OPTIONS.map(v => (
                <button
                  key={v}
                  onClick={() => onVerseRepetitionChange(v)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-inter font-semibold transition-all ${
                    verseRepetition === v
                      ? "bg-[#0D5C46] text-white shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  {v}×
                </button>
              ))}
            </div>
          </Section>

          {/* Chunk repeat */}
          <Section icon={<Repeat className="w-4 h-4" />} title="Chunk Repeat">
            <div className="flex gap-1.5 flex-wrap">
              {CHUNK_REP_OPTIONS.map(v => (
                <button
                  key={v}
                  onClick={() => onChunkRepetitionChange(v)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-inter font-semibold transition-all ${
                    chunkRepetition === v
                      ? "bg-[#0D5C46] text-white shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  {v === 0 ? "∞" : `${v}×`}
                </button>
              ))}
            </div>
          </Section>

          <Divider />

          {/* Inter-verse gap */}
          <Section icon={<Timer className="w-4 h-4" />} title="Gap Between Verses">
            <div className="flex gap-1.5 flex-wrap">
              {GAP_OPTIONS.map(g => (
                <button
                  key={g}
                  onClick={() => onInterVerseGapChange(g)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-inter font-semibold transition-all ${
                    interVerseGap === g
                      ? "bg-[#0D5C46] text-white shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  {g === 0 ? "None" : `${g}s`}
                </button>
              ))}
            </div>
          </Section>

          <Divider />

          {/* Shuffle + Auto-advance toggles */}
          <div className="space-y-3">
            <ToggleRow
              icon={<Shuffle className="w-4 h-4 text-muted-foreground" />}
              label="Shuffle Verses"
              description="Randomize verse order each loop"
              checked={shuffleVerses}
              onChange={onShuffleVersesChange}
            />
            <ToggleRow
              icon={<ChevronRight className="w-4 h-4 text-muted-foreground" />}
              label="Auto-Advance Chunk"
              description="Move to next chunk when done"
              checked={autoAdvanceChunk}
              onChange={onAutoAdvanceChunkChange}
            />
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({ icon, title, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-muted-foreground">{icon}</span>
        <h3 className="text-xs font-inter font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-border" />;
}

function ToggleRow({ icon, label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2.5">
        {icon}
        <div>
          <p className="text-sm font-inter font-medium text-foreground">{label}</p>
          <p className="text-xs font-inter text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}