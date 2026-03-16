# 🏠 HOME PAGE — Player / Reader / Recorder — Complete LLM Build Prompt

> **Target**: Coding agent (Cline / Cursor / Aider / Claude Code)
> **Framework**: Flutter (Dart) · Riverpod · go_router · just_audio · audio_service · record
> **This prompt covers**: The single most important screen in the app — where the user spends 95% of their time.

---

## 📌 CONTEXT FOR THE AGENT

You are building the **Home Page** of a Quran memorization app called **Hifz Companion**. This page is simultaneously a **Reader** (browse verses), a **Player** (play back recorded recitations with nested repetition loops), and a **Navigator** (move between chunks and surahs). It also provides a **Record** entry point that pushes a full-screen recording page on top.

**Core philosophy**: Low-effort Hifz through passive listening. Users record their recitations chunk-by-chunk, then listen passively throughout daily activities (headphones on, screen off) until they memorize the Quran. Everything happens inline on this page — no separate player screen.

**Route**: `/home` (query param: `?chunk={chunkId}`)

---

## 1. PAGE ZONES — VERTICAL LAYOUT

The page is a `Column` of **5 stacked zones** inside a `Scaffold`. All zones are **always present** in the widget tree, but Zone 4 (Status Bar) is conditionally visible.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ┌─ ZONE 1: HEADER BAR ──────────────────────────────────┐  │
│  │                                                        │  │
│  │  ╭────╮                                      ╭────╮   │  │
│  │  │ ◀  │    الفاتحة · Al-Fatihah             │ ▶  │   │  │
│  │  │prev│         Verses 1–7                  │next│   │  │
│  │  │chnk│                                     │chnk│   │  │
│  │  ╰────╯                                      ╰────╯   │  │
│  │                                                        │  │
│  │              ○ ○ ○ ● ○ ○ ○  ○ ○                        │  │
│  │              chunk position dots                       │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ ZONE 2: SURAH QUICK-SELECTOR ────────────────────────┐  │
│  │                                                        │  │
│  │  ╭──────────────────────────────────────────────────╮  │  │
│  │  │  📖  Al-Fatihah (1)  ·  7 verses  ·  Meccan  ▼  │  │  │
│  │  ╰──────────────────────────────────────────────────╯  │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ╔═ ZONE 3: VERSE SCROLLER (Expanded — fills remaining) ═╗  │
│  ║                                                        ║  │
│  ║  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  ║  │
│  ║    PREVIOUS VERSE — scale(0.85) · opacity(0.4)        ║  │
│  ║  │ Arabic + transliteration ONLY (no translation)   │  ║  │
│  ║  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  ║  │
│  ║                                                        ║  │
│  ║  ╭──────────────────────────────────────────────────╮  ║  │
│  ║  │ ④  CURRENT VERSE — scale(1.0) · opacity(1.0)    │  ║  │
│  ║  │                                                  │  ║  │
│  ║  │     إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ     │  ║  │
│  ║  │     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │  ║  │
│  ║  │     Iyyāka naʿbudu wa-iyyāka nastaʿīn          │  ║  │
│  ║  │     ─────────────────────────────────────────    │  ║  │
│  ║  │     You alone we worship, and You alone         │  ║  │
│  ║  │     we ask for help.                            │  ║  │
│  ║  │                                                  │  ║  │
│  ║  │  Shows: Arabic + Transliteration + Translation   │  ║  │
│  ║  ╰──────────────────────────────────────────────────╯  ║  │
│  ║                                                        ║  │
│  ║  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  ║  │
│  ║    NEXT VERSE — scale(0.85) · opacity(0.4)            ║  │
│  ║  │ Arabic + transliteration ONLY                    │  ║  │
│  ║  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  ║  │
│  ║                                                        ║  │
│  ╚════════════════════════════════════════════════════════╝  │
│                                                              │
│  ┌─ ZONE 4: PLAYBACK STATUS BAR (hidden when idle) ──────┐  │
│  │                                                        │  │
│  │  ◀◀  ▶/❚❚  ▶▶   ━━━━●━━━━━━  1:23/3:24              │  │
│  │                                                        │  │
│  │  Verse 4/7 · Rep 2/3 · Chunk 1/5   🔸 1.25x          │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ ZONE 5: CONTROL BAR ─────────────────────────────────┐  │
│  │                                                        │  │
│  │     ╭───────────╮              ╭───────────╮  ╭───╮   │  │
│  │     │  🎤       │              │   ▶️      │  │ ⋮ │   │  │
│  │     │  Record   │              │  Play     │  │   │   │  │
│  │     ╰───────────╯              ╰───────────╯  ╰───╯   │  │
│  │                                                 menu   │  │
│  │  ♫ Morning Session 1 · 03:24          (selected rec)   │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  🏠 Home   📖 Surahs   📑 Library   📊 Stats   ⚙️ More    │
│   ━━                                                         │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. PAGE STATES — FINITE STATE MACHINE

Implement **5 mutually exclusive states**. Use a Riverpod `StateNotifier` or enum-based provider.

```
┌──────────────┐     load chunk      ┌──────────────┐
│   LOADING    │ ──────────────────→ │    IDLE      │
│  (shimmer)   │                     │  (reading)   │
└──────────────┘                     └──────┬───────┘
                                            │
                              ┌──────────────┴──────────────┐
                              │                             │
                    chunk has recordings           chunk has NO recordings
                              │                             │
                              ▼                             ▼
                     ┌──────────────┐             ┌────────────────┐
                     │    IDLE      │             │ NO_RECORDING   │
                     │ (Play = ON) │             │ (Play = OFF)   │
                     └──────┬───────┘             └────────────────┘
                            │
                    user taps Play
                            │
                            ▼
                     ┌──────────────┐      user taps Pause
                     │   PLAYING    │ ─────────────────────→ ┌──────────────┐
                     │ (auto-scroll │                         │   PAUSED     │
                     │  status bar) │ ←───────────────────── │ (resume btn) │
                     └──────────────┘      user taps Resume   └──────────────┘
                            │
                 user taps Stop / playback ends
                            │
                            ▼
                     ┌──────────────┐
                     │    IDLE      │
                     └──────────────┘
```

**State-driven visibility rules:**

| Zone / Element             | LOADING | IDLE | NO_RECORDING | PLAYING | PAUSED |
|---------------------------|---------|------|--------------|---------|--------|
| Z1 Header Bar             | shimmer | ✅   | ✅           | ✅      | ✅     |
| Z2 Surah Selector         | shimmer | ✅   | ✅           | ✅      | ✅     |
| Z3 Verse Scroller         | shimmer | ✅ manual scroll | ✅ manual scroll | ✅ auto-scroll (locked) | ✅ manual scroll |
| Z4 Status Bar             | hidden  | hidden | hidden    | ✅ visible | ✅ visible (pause icon) |
| Z5 Record button          | hidden  | ✅   | ✅           | ✅      | ✅     |
| Z5 Play button            | hidden  | ✅ enabled | ❌ disabled (greyed) | morphs → Pause | morphs → Play |
| Z5 ⋮ menu                 | hidden  | ✅   | ✅ (subset)  | ✅      | ✅     |
| Z5 Selected recording label | hidden | ✅ shows name | "No recordings" | ✅ shows name | ✅ shows name |
| Current verse glow border | none    | none | none         | gold pulse (2s) | gold breathe (3s) |
| Bottom Nav Bar            | ✅      | ✅   | ✅           | ✅      | ✅     |

---

## 3. ZONE-BY-ZONE FUNCTIONAL SPECIFICATION

### ZONE 1 — HEADER BAR

**Purpose**: Navigate between chunks within the same surah.

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  ╭────╮                                        ╭────╮     │
│  │ ◀  │      الفاتحة · Al-Fatihah             │ ▶  │     │
│  │prev│           Verses 1–7                  │next│     │
│  ╰────╯                                        ╰────╯     │
│                                                            │
│              ○ ○ ○ ● ○ ○ ○  ○ ○                            │
│              ↑ chunk index dots                            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Functional requirements:**

- ◀ / ▶ buttons navigate to previous / next chunk
- ⚠️ **RTL INVERSION**: Because content is Arabic, the ◀ (prev) arrow points **RIGHT** (→) and ▶ (next) points **LEFT** (←). Implement via `Directionality.rtl` wrapper
- Center text: `{surah_name_arabic} · {surah_name_english}` (line 1) + `Verses {start}–{end}` (line 2)
- Chunk position dots: filled dot = current chunk. Horizontally scrollable if >15 chunks. Switch to `"4/41"` text format when >15 chunks
- Chunk transitions trigger **slide animation** (content slides left/right, 300ms, `easeInOut`)
- Debounce: 300ms lockout after each chunk change to prevent rapid navigation
- If at first chunk: ◀ disabled (dimmed). If at last chunk: ▶ disabled (dimmed)

**Data needed**: `currentChunkProvider`, `allChunksForSurahProvider`, `currentSurahProvider`

---

### ZONE 2 — SURAH QUICK-SELECTOR

**Purpose**: One-tap access to switch surahs.

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  ╭──────────────────────────────────────────────────╮      │
│  │  📖  Al-Fatihah (1)  ·  7 verses  ·  Meccan  ▼  │      │
│  ╰──────────────────────────────────────────────────╯      │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Functional requirements:**

- Tapping opens a **full-screen modal** (Surah Picker) with:
  - Search bar (filters by Arabic name, English name, transliteration, surah number)
  - Scrollable list of all 114 surahs
  - Each item shows: number, Arabic name, English name, verse count, revelation type, completion status badge
  - Tapping a surah → close modal → load that surah's first chunk into Zone 1/3
- Display format: `📖 {english_name} ({number}) · {total_verses} verses · {revelation_type} ▼`

---

### ZONE 3 — VERSE SCROLLER (Main Content Area)

**Purpose**: Display the Quranic text for the current chunk with a zoom/focus effect.

**Implementation**: Use `PageView` (vertical axis) with `PageController`.

```
VERSE CARD LAYOUT (for CURRENT verse):
┌────────────────────────────────────────────────────┐
│                                                    │
│                        ④                           │
│              (verse number badge)                   │
│                                                    │
│     إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ        │
│              (Arabic — large, centered)             │
│                                                    │
│     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │
│              (divider)                             │
│                                                    │
│     Iyyāka naʿbudu wa-iyyāka nastaʿīn            │
│              (Transliteration — italic)             │
│                                                    │
│     ─────────────────────────────────────────      │
│              (divider)                             │
│                                                    │
│     You alone we worship, and You alone            │
│     we ask for help.                               │
│              (Translation — smaller, muted)         │
│                                                    │
└────────────────────────────────────────────────────┘

VERSE CARD LAYOUT (for ADJACENT / non-current verses):
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
  ③ مَالِكِ يَوْمِ الدِّينِ                           
│    Māliki yawmi d-dīn                            │
     (Arabic + transliteration ONLY)                  
│    scale(0.85) · opacity(0.4)                    │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

**Functional requirements:**

- Use `PageView` with `viewportFraction` < 1.0 so adjacent cards peek in from top/bottom
- Current verse: `scale(1.0)`, `opacity(1.0)`, shows Arabic + transliteration + translation
- Adjacent verses: `scale(0.85)`, `opacity(0.4)`, shows Arabic + transliteration ONLY
- Animate zoom transitions: 300ms, `Curves.easeOut`, using `AnimatedContainer` with `Matrix4.scale`
- **During PLAYING state**: auto-scroll to the active verse. `PageController.animateToPage()`, 400ms, `Curves.easeInOutCubic`. User scroll is disabled (or re-enabled on pause)
- **During IDLE / PAUSED**: user can freely swipe to browse verses
- Tapping an adjacent (faded) card → jump to that verse (triggers zoom animation)
- Tapping Arabic text on current verse → toggle tafsir display below translation
- Long press current verse → context menu: Copy Arabic, Copy transliteration, Share verse
- Double tap current verse → bookmark (gold star badge appears)
- Pinch gesture → adjust Arabic font size (persist to settings)
- Active verse during playback gets a **gold border glow**: opacity pulses 20%→40%→20% over 2s loop, `easeInOut`
- Paused verse gets a **slower gold breathe**: 10%→30%→10% over 3s loop

**Data needed**: `versesForChunkProvider`, `currentVerseIndexProvider`, `playbackStateProvider`, `settingsProvider` (font size, show/hide toggles)

---

### ZONE 4 — PLAYBACK STATUS BAR

**Purpose**: Show playback progress, controls, and repetition counters. Only visible during PLAYING or PAUSED states.

```
STATE: PLAYING
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  ◀◀   ▶   ▶▶     ━━━━━━●━━━━━━━━━━━  1:23 / 3:24        │
│  prev play next         seek bar         elapsed/total     │
│                                                            │
│  Verse 4/7 · Rep 2/3 · Chunk 1/5         🔸 1.25x         │
│  (verse/total  rep/max   chunk/max)       (speed badge)    │
│                                                            │
└────────────────────────────────────────────────────────────┘

STATE: PAUSED
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  ◀◀   ❚❚   ▶▶    ━━━━━━●━━━━━━━━━━━  1:23 / 3:24        │
│  prev pause next        seek bar         elapsed/total     │
│                                                            │
│  Verse 4/7 · Rep 2/3 · Chunk 1/5  ⏸     🔸 1.25x         │
│                                  paused                    │
└────────────────────────────────────────────────────────────┘
```

**Functional requirements:**

- **Appear/disappear animation**: Slides up from behind Zone 5 when playback starts (200ms, `easeOut`). Slides back down when stopped (200ms, `easeIn`)
- **◀◀ (prev verse)**: Skip to previous verse within chunk. Resets verse repetition counter to 0
- **▶▶ (next verse)**: Skip to next verse within chunk. Resets verse repetition counter to 0
- **▶ / ❚❚**: Toggle play/pause. Icon morphs with 200ms rotation animation
- **Seek bar**: Draggable. Shows progress within the current verse's audio file. Tap anywhere to seek
- **Elapsed / Total**: `mm:ss / mm:ss` for current verse audio
- **Counter line**: `Verse {current}/{total} · Rep {verseRep}/{verseRepMax} · Chunk {chunkRep}/{chunkRepMax}`
  - If chunkRepMax = ∞, display `∞` symbol
- **Speed badge**: Shows current speed (e.g., `1.25x`). Tappable → cycles through: 0.5x, 0.75x, 1.0x, 1.25x, 1.5x, 2.0x

**Data needed**: `playbackStateProvider` (isPlaying, isPaused, currentVerseIndex, verseRepCount, chunkRepCount, elapsed, total, speed)

---

### ZONE 5 — CONTROL BAR

**Purpose**: Primary action buttons — Record and Play — plus overflow menu and selected recording label.

```
STATE: IDLE (no playback)
┌────────────────────────────────────────────────────────────┐
│                                                            │
│     ╭───────────╮                  ╭───────────╮  ╭───╮   │
│     │  🎤       │                  │   ▶️      │  │ ⋮ │   │
│     │  Record   │                  │  Play     │  │   │   │
│     ╰───────────╯                  ╰───────────╯  ╰───╯   │
│                                                    menu    │
│  ♫ Morning Session 1 · 03:24                               │
│     ↑ selected recording label (tap to open selector)      │
│                                                            │
└────────────────────────────────────────────────────────────┘

STATE: PLAYING
┌────────────────────────────────────────────────────────────┐
│                                                            │
│     ╭───────────╮                  ╭───────────╮  ╭───╮   │
│     │  🎤       │                  │   ⏸       │  │ ⋮ │   │
│     │  Record   │                  │  Pause    │  │   │   │
│     ╰───────────╯                  ╰───────────╯  ╰───╯   │
│                                                    menu    │
│  ♫ Morning Session 1 · 03:24   ▶ Playing...               │
│                                                            │
└────────────────────────────────────────────────────────────┘

STATE: NO_RECORDING
┌────────────────────────────────────────────────────────────┐
│                                                            │
│     ╭───────────╮                  ╭───────────╮  ╭───╮   │
│     │  🎤       │                  │   ▶️      │  │ ⋮ │   │
│     │  Record   │                  │  Play     │  │   │   │
│     ╰───────────╯                  ╰───────────╯  ╰───╯   │
│                                     (disabled)     menu    │
│  No recordings yet. Tap Record to create one.              │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Functional requirements:**

- **🎤 Record button**: Always active. Tapping navigates to `/record/{currentChunkId}` (full-screen push, covers bottom nav). On return, auto-refresh recordings list. If new recording was created, auto-select it
- **▶️ Play / ⏸ Pause button**: State-dependent icon morphing (200ms, `easeOut`). When tapped in IDLE state, **first check** if a recording is selected → if yes, start playback; if no, open recording selector bottom sheet first
- **⋮ Overflow menu**: Opens a bottom sheet with settings (see Section 4 below)
- **Selected recording label**: Shows `♫ {name} · {duration}`. Tapping opens the Recording Selector bottom sheet directly. If no recordings exist, shows helper text

---

## 4. BOTTOM SHEETS & MODALS

### 4.1 Recording Selector Bottom Sheet

Triggered by: tapping the recording label in Z5, or tapping Play when no recording is selected.

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│           Select Recording                    ╭────╮       │
│                                               │ ✕  │       │
│                                               ╰────╯       │
│  ──────────────────────────────────────────────────────    │
│                                                            │
│  ╭────────────────────────────────────────────────────╮    │
│  │  ● Morning Session 1            03:24              │    │
│  │    Jan 15, 2025                              ✅    │    │
│  ╰────────────────────────────────────────────────────╯    │
│                                                            │
│  ╭────────────────────────────────────────────────────╮    │
│  │  ○ Evening Practice              04:12              │    │
│  │    Jan 14, 2025                                    │    │
│  ╰────────────────────────────────────────────────────╯    │
│                                                            │
│  ╭────────────────────────────────────────────────────╮    │
│  │  ○ Quick Review                  02:58              │    │
│  │    Jan 13, 2025                                    │    │
│  ╰────────────────────────────────────────────────────╯    │
│                                                            │
│  ──────────────────────────────────────────────────────    │
│                                                            │
│  If empty:                                                 │
│  "No recordings for this chunk yet."                       │
│  "Tap 🎤 Record to create your first recording."           │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Functional requirements:**

- List all recordings for the **current chunk** (from `recordingsProvider`)
- Each item: radio select (●/○), name, duration, creation date, checkmark for currently selected
- Tap to select → close sheet → update selected recording label in Z5
- Long press → show delete confirmation dialog
- Swipe left → reveal delete button

---

### 4.2 Playback Settings Bottom Sheet (⋮ Menu)

Triggered by: tapping the ⋮ overflow button in Z5.

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│           Playback Settings                   ╭────╮       │
│                                               │ ✕  │       │
│                                               ╰────╯       │
│  ──────────────────────────────────────────────────────    │
│                                                            │
│  Speed                                                     │
│  ╭──────╮ ╭──────╮ ╭──────╮ ╭──────╮ ╭──────╮ ╭──────╮  │
│  │ 0.5x │ │ 0.75 │ │ 1.0x │ │ 1.25 │ │ 1.5x │ │ 2.0x │  │
│  ╰──────╯ ╰──────╯ ╰──────╯ ╰──────╯ ╰──────╯ ╰──────╯  │
│                        ━━━━●━━━━━━━━━━━  (fine slider)     │
│                                                            │
│  ──────────────────────────────────────────────────────    │
│                                                            │
│  Verse Repetition          [  1  ] [  2  ] [ ●3 ] [ 10 ]  │
│                                                            │
│  Chunk Repetition          [  1  ] [  2  ] [  3  ] [ ●∞ ]  │
│                                                            │
│  ──────────────────────────────────────────────────────    │
│                                                            │
│  Inter-Verse Gap                   ━━━━━●━━━━  1.5s       │
│  (silence between verses)                                  │
│                                                            │
│  ──────────────────────────────────────────────────────    │
│                                                            │
│  Ambience                                                  │
│  ╭──────╮ ╭──────╮ ╭──────╮ ╭──────╮ ╭──────╮            │
│  │ None │ │ Rain │ │ Echo │ │Nature│ │White │            │
│  ╰──────╯ ╰──────╯ ╰──────╯ ╰──────╯ ╰──────╯            │
│                                                            │
│  Ambience Volume            ━━━━━━●━━━━━━━  65%           │
│                                                            │
│  ──────────────────────────────────────────────────────    │
│                                                            │
│  Auto-Advance to Next Chunk          [ ● ON  /  ○ OFF ]    │
│                                                            │
│  Sleep Timer                         [ Off ▼ ]             │
│                                   (15m / 30m / 1h / 2h)   │
│                                                            │
│  Shuffle Verse Order                 [ ○ ON  /  ● OFF ]    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Functional requirements:**

- **Speed**: Chip selector for presets + fine-tune slider (0.5–2.0, step 0.05). Applies **immediately** during playback (no restart). Pitch preserved
- **Verse Repetition**: Chip selector [1, 2, 3, 10]. Applies from **next iteration**
- **Chunk Repetition**: Chip selector [1, 2, 3, ∞]. ∞ encoded as `0` internally. Applies from next iteration
- **Inter-Verse Gap**: Slider 0.0–5.0 seconds (step 0.5). Silence inserted between verse plays
- **Ambience**: Chip selector. Ambient audio loops mixed with recitation via secondary `AudioPlayer`. Independent volume slider (0–100%)
- **Auto-Advance**: When enabled, after the last chunk repetition ends, automatically load the next chunk and continue playback
- **Sleep Timer**: Dropdown [Off, 15m, 30m, 1h, 2h]. When timer expires, volume fades from 1.0→0.0 over 3 seconds, then stops playback
- **Shuffle**: When ON, verses within the chunk play in random order (useful for testing memorization). Applies from next chunk repetition
- All settings persisted to `settingsProvider` (Hive)

---

## 5. PLAYBACK ENGINE — NESTED REPETITION LOOP

This is the **core algorithm** of the entire app. Implement as an async method in your `PlaybackService` / `AudioHandler`.

```
PSEUDOCODE — PLAYBACK LOOP

function startPlayback(chunk, recording, settings):
    isPlaying = true
    chunkRepCount = 0

    // OUTER LOOP: chunk repetitions
    while isPlaying AND (chunkRepCount < settings.chunkRepetition OR settings.chunkRepetition == 0):

        verseOrder = settings.shuffle
            ? chunk.verses.shuffled()
            : chunk.verses

        // MIDDLE LOOP: iterate over each verse
        for verseIndex in 0..verseOrder.length:
            if NOT isPlaying: break

            currentVerseIndex = verseOrder[verseIndex]
            scrollToVerse(currentVerseIndex)  // triggers auto-scroll animation
            verseRepCount = 0

            // INNER LOOP: verse repetitions
            while isPlaying AND verseRepCount < settings.verseRepetition:

                verseAudioFile = recording.verse_files[currentVerseIndex].file_path
                audioPlayer.setFilePath(verseAudioFile)
                audioPlayer.setSpeed(settings.speed)
                audioPlayer.play()

                await audioPlayer.onComplete()  // wait for verse audio to finish

                if NOT isPlaying: break
                verseRepCount++
                updateUI(verseRepCount, chunkRepCount)

                // Inter-verse gap (only between reps, not after last)
                if verseRepCount < settings.verseRepetition:
                    await delay(settings.interVerseGap)

            // Gap between verses (when moving to next verse)
            if isPlaying AND verseIndex < verseOrder.length - 1:
                await delay(settings.interVerseGap)

        chunkRepCount++
        updateUI(0, chunkRepCount)

        // Auto-advance to next chunk
        if isPlaying AND settings.autoAdvance AND isLastChunkRep:
            loadNextChunk()
            // loop continues with new chunk

    // Playback complete
    isPlaying = false
    resetToIdle()
```

**Total plays per verse** = `verseRepetition × chunkRepetition`
**Example**: verse rep = 3, chunk rep = 5 → each verse heard 15 times per session.

---

## 6. RECORD BUTTON BEHAVIOR

The 🎤 Record button in Zone 5 is a **navigation trigger**, not an inline action.

```
USER TAPS [🎤 Record]
  │
  ├─→ If playback is active (PLAYING or PAUSED):
  │     ├─→ Stop playback completely
  │     ├─→ Reset to IDLE state
  │     └─→ Then navigate
  │
  ├─→ Navigator.push('/record/{currentChunkId}')
  │     (full-screen page, no bottom nav, covers everything)
  │
  └─→ On return from Recording Page:
        ├─→ Refresh recordingsProvider (re-fetch recordings for chunk)
        ├─→ If a new recording was created:
        │     ├─→ Auto-select the new recording
        │     └─→ Update recording label in Z5
        └─→ If cancelled/discarded:
              └─→ No changes, resume IDLE state
```

**The Recording Page** (specified separately) is a **forward-only, per-verse recording flow**:
1. Shows one verse at a time
2. Auto-starts recording when verse appears
3. Single "NEXT" button (becomes "FINISH" on last verse)
4. Saves each verse as a separate `.m4a` file
5. After finishing → naming dialog → saves recording entity → pops back to Home

---

## 7. GESTURE MAP

| Gesture | Zone | Action |
|---------|------|--------|
| Vertical swipe | Z3 (Verse Scroller) | Navigate between verses within chunk |
| Horizontal swipe | Z1 (Header) or screen edge | Navigate between chunks (slide animation) |
| Tap | Adjacent (faded) verse in Z3 | Jump to that verse |
| Tap | Arabic text on current verse | Toggle tafsir below translation |
| Long press | Current verse card | Context menu: Copy Arabic, Copy transliteration, Share, Set A/B point |
| Double tap | Current verse card | Bookmark verse (gold star badge) |
| Tap | Surah selector (Z2) | Open surah picker modal |
| Tap | Recording label (Z5) | Open recording selector bottom sheet |
| Tap | Seek bar (Z4) | Seek within current verse audio |
| Drag | Seek bar thumb (Z4) | Scrub through verse audio |
| Tap | ◀◀ / ▶▶ (Z4) | Skip prev/next verse (reset verse rep counter) |
| Tap | Speed badge (Z4) | Cycle through speed presets |
| Pinch | Z3 | Adjust Arabic font size (persist to settings) |

---

## 8. ANIMATION TABLE

| Animation | Trigger | Duration | Curve | Implementation |
|-----------|---------|----------|-------|----------------|
| Verse zoom in | Verse becomes current | 300ms | `easeOut` | `AnimatedContainer` + `Matrix4.scale(0.85→1.0)` + `AnimatedOpacity(0.4→1.0)` |
| Verse zoom out | Verse becomes adjacent | 300ms | `easeOut` | `Matrix4.scale(1.0→0.85)` + `AnimatedOpacity(1.0→0.4)` |
| Chunk slide | ◀/▶ chunk navigation | 300ms | `easeInOut` | `PageController.animateToPage()` on horizontal `PageView` or `AnimatedSwitcher` with `SlideTransition` |
| Auto-scroll | Verse changes during playback | 400ms | `easeInOutCubic` | `PageController.animateToPage()` |
| Status bar appear | Playback starts | 200ms | `easeOut` | `AnimatedSlide` or `AnimatedContainer` height 0→actual |
| Status bar disappear | Playback stops | 200ms | `easeIn` | Reverse of above |
| Active glow | Verse playing | 2s loop | `easeInOut` | Border opacity pulse 20%→40%→20% via `AnimationController` + `CurvedAnimation` |
| Pause breathe | Verse paused | 3s loop | `easeInOut` | Border opacity 10%→30%→10% (slower) |
| Chunk dots | Chunk changes | 200ms | `easeOut` | Dot fill/unfill via `AnimatedContainer` |
| Recording label swap | Recording selected | 150ms | `easeOut` | `AnimatedSwitcher` with fade |
| Play button morph | Play↔Pause↔Stop | 200ms | `easeOut` | `AnimatedIcon` or custom icon rotation + color |
| Sleep timer fade | Timer expires | 3000ms | `linear` | Volume 1.0→0.0 linear ramp |
| Font size pinch | Pinch gesture | Real-time | — | `GestureDetector` + `onScaleUpdate` → scale Arabic text |

---

## 9. BACKGROUND AUDIO & LOCK SCREEN

**Critical for the app's core philosophy** — users listen with screen off all day.

| Feature | Implementation |
|---------|----------------|
| Screen-off playback | `audio_service` package + `BaseAudioHandler` subclass |
| Lock screen controls | Play/Pause/Stop + prev/next verse. Metadata: surah name, verse range |
| Notification | Android: `MediaStyle` notification. iOS: Control Center integration |
| Bluetooth/headset | Auto-resume on headphone reconnect. Pause on disconnect |
| MediaSession metadata | Title: `{surahName} · Verse {N}`. Artist: `Hifz Companion`. Album: `{recordingName}` |
| Sleep timer | Runs in background. Auto-fades and stops even with screen off |
| Audio focus | Respect system audio focus. Duck/pause during calls. Resume after |

**Implementation pattern:**

```
class HifzAudioHandler extends BaseAudioHandler with SeekHandler {
    AudioPlayer _recitationPlayer
    AudioPlayer _ambientPlayer

    // Expose:
    //   play(), pause(), stop(), seek(), skipToNext(), skipToPrevious()
    //   setSpeed(), customAction('setAmbience'), customAction('setRepetition')
    //
    // Update playbackState stream:
    //   playing, processingState, controls, position, bufferedPosition, speed
    //
    // Update mediaItem stream:
    //   title, artist, album, duration, artUri (app icon)
}
```

---

## 10. DATA FLOW — RIVERPOD PROVIDERS

```
┌─────────────────────────────────────────────────────────┐
│                    RIVERPOD PROVIDERS                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  currentSurahProvider ──→ Surah (from JSON asset)       │
│  currentChunkProvider ──→ Chunk (from Hive/SQLite)      │
│  allChunksForSurahProvider → List<Chunk> for dots       │
│  versesForChunkProvider → Filtered verses for chunk     │
│  recordingsProvider ────→ List<Recording> for chunk     │
│  selectedRecordingProvider → Currently selected one     │
│  settingsProvider ──────→ UserSettings (from Hive)      │
│  playbackStateProvider ─→ PlaybackState {               │
│    status: idle|playing|paused|loading,                 │
│    currentVerseIndex: int,                              │
│    verseRepCount: int,                                  │
│    chunkRepCount: int,                                  │
│    elapsed: Duration,                                   │
│    total: Duration,                                     │
│    speed: double,                                       │
│    ambience: AmbienceType,                              │
│    ambienceVolume: double                               │
│  }                                                      │
│  lastActiveChunkProvider → Persisted chunk ID (Hive)    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**On `currentChunkProvider` change:**
1. Persist to `lastActiveChunkProvider` in Hive
2. Update chunk's `lastAccessed` timestamp
3. Reload `versesForChunkProvider`
4. Reload `recordingsProvider`
5. Stop any active playback → reset `playbackStateProvider`
6. Reset verse scroller to verse index 0

---

## 11. EDGE CASES

| Scenario | Handling |
|----------|----------|
| No chunks for surah | Auto-generate via `ChunkGenerator` on first access. Show shimmer |
| Recording deleted externally | On playback attempt, verify all verse files exist. If missing → "Recording files missing. Re-record?" → remove from list |
| Chunk with 1 verse | Verse repetition works (plays N times). No ◀◀/▶▶ in Z4. Chunk repetition re-plays the single verse |
| Very long surah (286 verses / 41+ chunks) | Chunk dots → scrollable strip, or switch to `"4/41"` text when >15 |
| Interrupted audio focus | Pause on phone call / alarm. Auto-resume when focus returns (configurable) |
| Settings changed during playback | Speed: applies immediately. Repetitions: apply from next iteration. Ambience: crossfade over 500ms |
| Rapid chunk navigation | Debounce 300ms lockout. Cancel in-flight chunk loads |
| Return from Record page | Auto-refresh recording list. Auto-select new recording if created |
| App cold start | Load `lastActiveChunkProvider` from Hive. If found → load chunk. If not → redirect to `/surahs`. Show shimmer while loading |
| Landscape mode | Verse card expands horizontally. Controls compact. Status bar single-line |

---

## 12. FILE & FOLDER STRUCTURE (suggested)

```
lib/
├── main.dart
├── app/
│   ├── router.dart                    // GoRouter config
│   ├── theme.dart                     // ThemeData + colors + text styles
│   └── shell.dart                     // MainShell with BottomNavigationBar
│
├── features/
│   ├── home/
│   │   ├── home_page.dart             // Main widget — assembles all 5 zones
│   │   ├── widgets/
│   │   │   ├── header_bar.dart        // Zone 1
│   │   │   ├── surah_selector.dart    // Zone 2
│   │   │   ├── verse_scroller.dart    // Zone 3
│   │   │   ├── verse_card.dart        // Individual verse card
│   │   │   ├── playback_status_bar.dart // Zone 4
│   │   │   ├── control_bar.dart       // Zone 5
│   │   │   ├── recording_selector_sheet.dart
│   │   │   ├── playback_settings_sheet.dart
│   │   │   └── surah_picker_modal.dart
│   │   └── providers/
│   │       ├── home_providers.dart
│   │       └── playback_state.dart
│   │
│   ├── recording/
│   │   ├── record_page.dart
│   │   ├── widgets/
│   │   └── providers/
│   │
│   ├── surahs/    ...
│   ├── library/   ...
│   ├── progress/  ...
│   └── settings/  ...
│
├── core/
│   ├── audio/
│   │   ├── playback_service.dart      // Nested repetition loop engine
│   │   ├── audio_handler.dart         // HifzAudioHandler (BaseAudioHandler)
│   │   ├── recording_service.dart     // Mic recording wrapper
│   │   └── ambient_mixer.dart         // Ambient audio layer
│   │
│   ├── data/
│   │   ├── models/                    // Surah, Verse, Chunk, Recording, Settings
│   │   ├── repositories/             // QuranRepo, ChunkRepo, RecordingRepo, SettingsRepo
│   │   └── quran_data_loader.dart    // JSON asset loader
│   │
│   └── utils/
│       ├── chunk_generator.dart       // Auto-chunk algorithm
│       └── constants.dart
│
└── assets/
    ├── data/quran.json
    ├── fonts/AmiriQuran-Regular.ttf
    └── audio/ambient/               // rain.mp3, nature.mp3, whitenoise.mp3
```

---

## 13. CRITICAL REQUIREMENTS CHECKLIST

⚠️ **Must implement ALL of these. Missing any = build failure.**

| # | Requirement | Priority |
|---|-------------|----------|
| 1 | Playback happens on Home — **NO separate player page** | 🔴 CRITICAL |
| 2 | Auto-scroll verses during playback (400ms, easeInOutCubic) | 🔴 CRITICAL |
| 3 | Nested repetition: verse × chunk loops | 🔴 CRITICAL |
| 4 | Infinite chunk repetition (∞ = 0 internally) | 🔴 CRITICAL |
| 5 | Background audio with lock screen controls | 🔴 CRITICAL |
| 6 | Verse zoom effect (1.0 current, 0.85 adjacent) | 🔴 CRITICAL |
| 7 | Chunk slide transitions (300ms, easeInOut) | 🔴 CRITICAL |
| 8 | RTL arrows (prev = →, next = ←) | 🔴 CRITICAL |
| 9 | Default entry = last active chunk (not a dashboard) | 🔴 CRITICAL |
| 10 | 2 buttons (Record + Play) + ⋮ menu (not 3 FABs) | 🟡 HIGH |
| 11 | Record button navigates to `/record/{chunkId}` | 🟡 HIGH |
| 12 | Auto-select new recording on return from Record page | 🟡 HIGH |
| 13 | Pause/Resume mid-playback | 🟡 HIGH |
| 14 | Seek within current verse audio | 🟡 HIGH |
| 15 | Skip verse (◀◀/▶▶) during playback | 🟡 HIGH |
| 16 | Status bar with rep counters + progress | 🟡 HIGH |
| 17 | Speed change applies live (no restart), pitch preserved | 🟡 HIGH |
| 18 | Ambience mixing with independent volume | 🟡 HIGH |
| 19 | Inter-verse gap (configurable silence) | 🟡 HIGH |
| 20 | Auto-advance to next chunk | 🟡 HIGH |
| 21 | Sleep timer with volume fade-out | 🟢 MEDIUM |
| 22 | Shuffle verse order mode | 🟢 MEDIUM |
| 23 | Pinch-to-zoom Arabic font size | 🟢 MEDIUM |
| 24 | Tap verse for tafsir toggle | 🟢 MEDIUM |
| 25 | Double-tap bookmark | 🟢 MEDIUM |
| 26 | Long-press context menu (copy, share) | 🟢 MEDIUM |
| 27 | Surah picker with search | 🟢 MEDIUM |

---

## 14. IMPLEMENTATION ORDER

Build in this sequence to avoid dependency issues:

```
PHASE 1: Data Layer
  ├─→ Models (Surah, Verse, Chunk, Recording, Settings) with Freezed
  ├─→ QuranDataLoader (JSON asset → Surah objects)
  ├─→ Repositories (CRUD for chunks, recordings, settings via Hive)
  └─→ Riverpod providers for all data

PHASE 2: Home Page Shell
  ├─→ HomePage widget with 5-zone Column layout
  ├─→ Zone 1: Header bar with chunk dots (static)
  ├─→ Zone 2: Surah selector (static chip)
  ├─→ Zone 3: Verse scroller with PageView + zoom animation
  ├─→ Zone 5: Control bar with Record + Play buttons (static)
  └─→ Bottom nav integration

PHASE 3: Chunk Navigation
  ├─→ ◀/▶ chunk navigation with slide animation
  ├─→ RTL arrow inversion
  ├─→ Chunk dots update + scroll
  └─→ Debounce logic

PHASE 4: Recording Integration
  ├─→ Record button → Navigator.push('/record/{chunkId}')
  ├─→ Recording selector bottom sheet
  ├─→ Auto-refresh + auto-select on return
  └─→ Selected recording label display

PHASE 5: Playback Engine
  ├─→ PlaybackService with nested repetition loop
  ├─→ Play/Pause/Stop state machine
  ├─→ Auto-scroll during playback
  ├─→ Zone 4: Status bar appear/disappear
  └─→ Seek bar + skip controls

PHASE 6: Background Audio
  ├─→ HifzAudioHandler (BaseAudioHandler)
  ├─→ Lock screen controls + notification
  ├─→ MediaSession metadata
  └─→ Audio focus handling

PHASE 7: Settings & Ambience
  ├─→ Playback settings bottom sheet
  ├─→ Speed control (live apply)
  ├─→ Ambience mixer (secondary AudioPlayer)
  ├─→ Sleep timer with fade
  └─→ All settings persistence

PHASE 8: Polish
  ├─→ All animations (glow, breathe, morph, dots)
  ├─→ Gestures (pinch, long-press, double-tap)
  ├─→ Edge case handling
  ├─→ Loading skeletons (shimmer)
  └─→ Accessibility (Semantics widgets)
```

---

**END OF PROMPT — Implement this specification completely. Do not add features not listed here. Do not simplify the nested repetition logic. Do not create a separate player page. Everything happens on `/home`.** ✅
