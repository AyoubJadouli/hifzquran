# 🎤 RECORDING PAGE — Complete LLM Build Prompt

> **Target**: Coding agent (Cline / Cursor / Aider / Claude Code)
> **Framework**: Flutter (Dart) · Riverpod · go_router · record package
> **This prompt covers**: The full-screen, distraction-free recording activity where users capture per-verse audio files.

---

## 📌 CONTEXT FOR THE AGENT

You are building the **Recording Page** of a Quran memorization app called **Hifz Companion**. This is a **full-screen, immersive activity** that pushes on top of the Home Page. It captures the user's voice reciting Quranic verses **one at a time**, saving each verse as a **separate audio file**. The flow is **forward-only** — no going back to re-record previous verses (only the current verse can be redone).

The user enters this page by tapping 🎤 Record on the Home Page. On completion, it saves a `Recording` entity (containing references to all per-verse audio files) and pops back to the Home Page.

**Route**: `/record/:chunkId`

---

## 1. DESIGN PHILOSOPHY

- ❌ **NO** bottom navigation bar — full-screen immersive
- ❌ **NO** unnecessary headers (no "Record Your Recitation" title)
- ❌ **NO** Previous button — forward-only flow
- ✅ **ONE** verse visible at a time — maximum focus
- ✅ **ONE** primary action button — NEXT (becomes FINISH on last verse)
- ✅ **Auto-start** recording the instant a verse appears
- ✅ **Auto-stop** recording the instant NEXT / FINISH is tapped
- ✅ **Per-verse files** — each verse = separate `.m4a` audio file

---

## 2. ENTRY & EXIT FLOWS

```
ENTRY:
  User taps [🎤 Record] on Home Page (or [🎤] on Surah Detail)
    │
    └─→ Navigator.push('/record/{chunkId}')
          │
          ├─→ Full-screen push (covers bottom nav + Home Page)
          ├─→ Load chunk data (surah info, verses for this chunk)
          ├─→ Request microphone permission
          │     ├─→ GRANTED → continue
          │     └─→ DENIED → show dialog:
          │           "Microphone access is required to record."
          │           [Open Settings]  [Go Back]
          │           Go Back → Navigator.pop()
          └─→ Auto-start recording for verse 1

NORMAL EXIT (complete recording):
  User taps [FINISH ✓] on last verse
    │
    ├─→ Stop recording for last verse
    ├─→ Save last verse audio file
    ├─→ Show Save Dialog (naming + summary)
    │     ├─→ [💾 SAVE] → persist Recording entity → navigate to /home?chunk={chunkId}
    │     └─→ [🗑️ DISCARD] → delete ALL temp audio files → Navigator.pop()
    └─→ Home Page auto-selects new recording

CANCEL EXIT (abandon recording):
  User taps [✕ Close] in header
    │
    ├─→ IF any verses recorded:
    │     └─→ Show confirmation dialog:
    │           "Discard recording?"
    │           "You've recorded {N} of {total} verses. This cannot be undone."
    │           [Cancel]  [Discard]
    │           Discard → delete ALL temp audio files → Navigator.pop()
    │
    └─→ IF no verses recorded yet:
          └─→ Navigator.pop() immediately (no confirmation)

SYSTEM BACK:
  Same as ✕ Close — show confirmation if recording is in progress
```

---

## 3. PAGE STATES — FINITE STATE MACHINE

```
┌────────────────┐    mic granted     ┌────────────────┐
│ REQUESTING_MIC │ ─────────────────→ │  RECORDING_A   │
│  (permission)  │                    │ (normal verse)  │
└────────────────┘                    │  verses 1..N-1  │
        │                             └───────┬─────────┘
   mic denied                                 │
        │                         user taps NEXT
        ▼                                     │
┌────────────────┐                            ▼
│  MIC_DENIED    │              ┌─────────────────────────┐
│ (error dialog) │              │   stop + save + animate  │
└────────────────┘              │   + auto-start next      │
                                └─────────────┬───────────┘
                                              │
                                   is last verse?
                                    ┌────┴────┐
                                   NO        YES
                                    │         │
                                    ▼         ▼
                           RECORDING_A   RECORDING_B
                           (loops back)  (last verse)
                                              │
                                     user taps FINISH
                                              │
                                              ▼
                                    ┌────────────────┐
                                    │  SAVE_DIALOG   │
                                    │ (naming modal) │
                                    └───────┬────────┘
                                   ┌────────┴────────┐
                                  SAVE            DISCARD
                                   │                 │
                                   ▼                 ▼
                            navigate to        delete files
                            /home?chunk=       Navigator.pop()

BRANCHING SUB-STATES (from RECORDING_A or RECORDING_B):

  User taps [🔄 Redo]:
    └─→ REDO sub-state
          ├─→ Stop recording for current verse
          ├─→ Delete current verse's temp audio file
          ├─→ Reset verse timer to 00:00
          ├─→ Flatten waveform
          └─→ Auto-start NEW recording for SAME verse
              (returns to RECORDING_A or RECORDING_B)

  User taps [▶ Preview]:
    └─→ PREVIEW sub-state
          ├─→ Stop/pause recording temporarily
          ├─→ Flatten waveform
          ├─→ Play back current verse's audio file
          ├─→ Button changes to [⏸ Stop Preview]
          ├─→ When playback ends OR user taps Stop Preview:
          │     ├─→ Stop playback
          │     ├─→ Delete old audio (simplest: re-record after preview)
          │     ├─→ Reset verse timer
          │     └─→ Auto-start fresh recording
          └─→ Returns to RECORDING_A or RECORDING_B
```

---

## 4. PAGE LAYOUT — ZONE MAP

The page is a full-screen `Scaffold` with **NO** bottom navigation bar. Vertical `Column` of 5 zones:

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ZONE 1 — HEADER BAR (close + surah info + session timer)   │
│  ZONE 2 — PROGRESS TRACK (verse blocks: filled vs empty)    │
│  ZONE 3 — VERSE DISPLAY (single verse, Expanded)            │
│  ZONE 4 — WAVEFORM VISUALIZER (live amplitude bars + timer) │
│  ZONE 5 — ACTION AREA (NEXT/FINISH + Redo + Preview)        │
│                                                              │
│  (NO bottom navigation bar — full-screen immersive)          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 5. ASCII WIREFRAMES — ALL STATES

### 5.1 STATE A — Recording a Normal Verse (e.g., verse 4 of 7)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ┌─ Z1: HEADER BAR ──────────────────────────────────────┐  │
│  │                                                        │  │
│  │  ╭──╮                                    ╭──────────╮  │  │
│  │  │✕ │    الفاتحة · Al-Fatihah           │ 🔴 01:47 │  │  │
│  │  ╰──╯    Verses 1–7                     ╰──────────╯  │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ Z2: PROGRESS TRACK ──────────────────────────────────┐  │
│  │                                                        │  │
│  │   ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ░░░░░░  ░░░░░░  ░░░░░░   │  │
│  │     1        2        3       4        5        6      │  │
│  │                                                        │  │
│  │   ░░░░░░                              Verse 4 of 7    │  │
│  │     7                                                  │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ╔═ Z3: VERSE DISPLAY (Expanded) ════════════════════════╗  │
│  ║                                                        ║  │
│  ║                          ④                             ║  │
│  ║                 (verse number badge)                    ║  │
│  ║                                                        ║  │
│  ║                                                        ║  │
│  ║       إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ          ║  │
│  ║                    (Arabic — large)                     ║  │
│  ║                                                        ║  │
│  ║       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       ║  │
│  ║                                                        ║  │
│  ║       Iyyāka naʿbudu wa-iyyāka nastaʿīn               ║  │
│  ║                 (Transliteration — italic)              ║  │
│  ║                                                        ║  │
│  ║       ─────────────────────────────────────────────    ║  │
│  ║                                                        ║  │
│  ║       You alone we worship, and You alone              ║  │
│  ║       we ask for help.                                 ║  │
│  ║                 (Translation — smaller)                 ║  │
│  ║                                                        ║  │
│  ╚════════════════════════════════════════════════════════╝  │
│                                                              │
│  ┌─ Z4: WAVEFORM VISUALIZER ─────────────────────────────┐  │
│  │                                                        │  │
│  │  ▁ ▂ ▄ ▆ █ ▇ ▅ ▃ ▂ ▁ ▃ ▅ ▇ █ ▆ ▄ ▂ ▁ ▃ ▅ ▇ █ ▆   │  │
│  │                                                        │  │
│  │                       00:12                            │  │
│  │               (current verse elapsed)                  │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ Z5: ACTION AREA ─────────────────────────────────────┐  │
│  │                                                        │  │
│  │              ╭──────────────────────╮                  │  │
│  │              │      NEXT   ▶        │                  │  │
│  │              ╰──────────────────────╯                  │  │
│  │                                                        │  │
│  │              Recite, then tap Next                     │  │
│  │                                                        │  │
│  │     ╭────────────╮            ╭────────────╮           │  │
│  │     │  🔄 Redo   │            │  ▶ Preview │           │  │
│  │     ╰────────────╯            ╰────────────╯           │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  (NO bottom navigation bar)                                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 5.2 STATE B — Recording the Last Verse (verse 7 of 7)

Differences from State A marked with `← CHANGED`:

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ┌─ Z1: HEADER BAR ──────────────────────────────────────┐  │
│  │                                                        │  │
│  │  ╭──╮                                    ╭──────────╮  │  │
│  │  │✕ │    الفاتحة · Al-Fatihah           │ 🔴 03:24 │  │  │
│  │  ╰──╯    Verses 1–7                     ╰──────────╯  │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ Z2: PROGRESS TRACK ──────────────────────────────────┐  │
│  │                                                        │  │
│  │   ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓   │  │
│  │     1        2        3       4        5        6      │  │
│  │                                                        │  │
│  │   ░░░░░░                              Verse 7 of 7    │  │ ← CHANGED
│  │     ⑦                                  (last!)        │  │ ← CHANGED
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ╔═ Z3: VERSE DISPLAY (Expanded) ════════════════════════╗  │
│  ║                                                        ║  │
│  ║                          ⑦                             ║  │ ← CHANGED
│  ║                                                        ║  │
│  ║       صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ             ║  │ ← CHANGED
│  ║       غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ    ║  │ ← CHANGED
│  ║                                                        ║  │
│  ║       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       ║  │
│  ║                                                        ║  │
│  ║       Ṣirāṭa alladhīna anʿamta ʿalayhim               ║  │ ← CHANGED
│  ║       ghayri l-maghḍūbi ʿalayhim wa-lā ḍ-ḍāllīn       ║  │ ← CHANGED
│  ║                                                        ║  │
│  ║       ─────────────────────────────────────────────    ║  │
│  ║                                                        ║  │
│  ║       The path of those upon whom You have             ║  │ ← CHANGED
│  ║       bestowed favor, not of those who have            ║  │ ← CHANGED
│  ║       earned anger or of those who are astray.         ║  │ ← CHANGED
│  ║                                                        ║  │
│  ╚════════════════════════════════════════════════════════╝  │
│                                                              │
│  ┌─ Z4: WAVEFORM VISUALIZER ─────────────────────────────┐  │
│  │                                                        │  │
│  │  ▁ ▂ ▄ ▆ █ ▇ ▅ ▃ ▂ ▁ ▃ ▅ ▇ █ ▆ ▄ ▂ ▁ ▃ ▅ ▇ █ ▆   │  │
│  │                                                        │  │
│  │                       00:28                            │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ Z5: ACTION AREA ─────────────────────────────────────┐  │
│  │                                                        │  │
│  │              ╭──────────────────────╮                  │  │
│  │              │     FINISH   ✓       │                  │  │ ← CHANGED
│  │              ╰──────────────────────╯                  │  │
│  │                                                        │  │
│  │            Final verse! Tap to save.                   │  │ ← CHANGED
│  │                                                        │  │
│  │     ╭────────────╮            ╭────────────╮           │  │
│  │     │  🔄 Redo   │            │  ▶ Preview │           │  │
│  │     ╰────────────╯            ╰────────────╯           │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 5.3 STATE D — Save Dialog (modal overlay after last verse)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ░░░░░░░░░░░░░░░░░ (dimmed background) ░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                              │
│         ╭────────────────────────────────────────╮           │
│         │                                        │           │
│         │              ✅ Complete!               │           │
│         │                                        │           │
│         │    ────────────────────────────────     │           │
│         │                                        │           │
│         │    📖  Al-Fatihah                       │           │
│         │    📍  Verses 1–7                       │           │
│         │    ⏱️  03:24 total                      │           │
│         │    🎙️  7 verses recorded                │           │
│         │                                        │           │
│         │    ────────────────────────────────     │           │
│         │                                        │           │
│         │    Name your recording                 │           │
│         │    ╭────────────────────────────────╮   │           │
│         │    │ Morning Session 1       |      │   │           │
│         │    ╰────────────────────────────────╯   │           │
│         │                                        │           │
│         │    ╭────────────────────────────────╮   │           │
│         │    │          💾  SAVE              │   │           │
│         │    ╰────────────────────────────────╯   │           │
│         │                                        │           │
│         │             🗑️  Discard                 │           │
│         │                                        │           │
│         ╰────────────────────────────────────────╯           │
│                                                              │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 5.4 CANCEL CONFIRMATION DIALOG

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ░░░░░░░░░░░░░░░░░ (dimmed background) ░░░░░░░░░░░░░░░░░░  │
│                                                              │
│              ╭──────────────────────────────╮                │
│              │                              │                │
│              │    Discard recording?        │                │
│              │                              │                │
│              │    You've recorded 4 of 7    │                │
│              │    verses. This cannot be    │                │
│              │    undone.                   │                │
│              │                              │                │
│              │    ╭────────╮  ╭────────╮    │                │
│              │    │ Cancel │  │Discard │    │                │
│              │    ╰────────╯  ╰────────╯    │                │
│              │                              │                │
│              ╰──────────────────────────────╯                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 6. ZONE-BY-ZONE FUNCTIONAL SPECIFICATION

### ZONE 1 — HEADER BAR

```
╭──╮                                    ╭──────────╮
│✕ │    {surah_arabic} · {surah_eng}   │ 🔴 MM:SS │
╰──╯    Verses {start}–{end}           ╰──────────╯
```

**Functional requirements:**

- **✕ Close** (top-left): 40×40 tap target. On tap → cancel exit flow (see Section 2)
- **Center text**: `{surah_name_arabic} · {surah_name_english}` (line 1) + `Verses {start}–{end}` (line 2). Static — does not change during recording
- **🔴 Session timer** (top-right): Red pulsing dot + `MM:SS` counter. Starts at `00:00` on page load. Counts **total session time** (not per-verse). Red dot opacity pulses 0.3→1.0→0.3 in a 1-second loop. Monospace font for timer digits
- Timer continues counting during Preview playback
- Timer stops when Save Dialog appears

---

### ZONE 2 — PROGRESS TRACK

```
▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ░░░░░░  ░░░░░░  ░░░░░░  ░░░░░░
   1        2        3       4        5        6        7

                                             Verse 4 of 7
```

**Functional requirements:**

- One **block** per verse in the chunk, arranged horizontally with gaps
- **Filled block** (▓): verse has been recorded and saved
- **Empty block** (░): verse not yet recorded
- **Current block**: highlighted with a distinct treatment (pulsing border or accent outline) to show "recording now"
- When NEXT is tapped: the current block animates to filled (color wipe left→right, 200ms, `easeOut`)
- Below the blocks: `Verse {current} of {total}` text, right-aligned
- If chunk has >12 verses: blocks shrink proportionally to fit. If >20: switch to a thin progress bar with segment markers
- Blocks are **not tappable** — no random-access to verses (forward-only)

---

### ZONE 3 — VERSE DISPLAY

**Purpose**: Show the single verse the user needs to recite. Centered, clean, no distractions.

```
                          ④
                 (verse number badge)

       إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ
                    (Arabic — large)

       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                 (thick separator)

       Iyyāka naʿbudu wa-iyyāka nastaʿīn
                 (Transliteration — italic)

       ─────────────────────────────────────────────
                 (thin separator)

       You alone we worship, and You alone
       we ask for help.
                 (Translation — smaller, muted)
```

**Functional requirements:**

- **Verse number badge**: Circled number at the top (e.g., ④). Centered
- **Arabic text**: Large, centered. Use Uthmanic script font (AmiriQuran or similar). Arabic text direction is RTL — wrap in `Directionality.rtl`
- **Thick separator**: Between Arabic and transliteration
- **Transliteration**: Italic, center-aligned. Visible based on user settings
- **Thin separator**: Between transliteration and translation
- **Translation**: Smaller, muted color, center-aligned. Visible based on user settings
- **Container**: `Expanded` widget. Content vertically and horizontally centered. Padding: 24px all sides
- **Verse transition animation**: When advancing, current verse slides out left + fades (300ms, `easeInOut`), new verse slides in from right + fades in. Use `AnimatedSwitcher` with `SlideTransition`
- **Very long verse handling**: Wrap verse display in `SingleChildScrollView` to handle overflow (some verses are very long)

**Display modes** (controlled by user settings):

| Mode | Shows |
|------|-------|
| Arabic Only | Arabic text only |
| Transliteration Only | Transliteration only |
| Arabic + Transliteration | Both, no translation |
| Full (default) | Arabic + Transliteration + Translation |

---

### ZONE 4 — WAVEFORM VISUALIZER

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  ▁ ▂ ▄ ▆ █ ▇ ▅ ▃ ▂ ▁ ▃ ▅ ▇ █ ▆ ▄ ▂ ▁ ▃ ▅ ▇ █ ▆        │
│                                                            │
│                       00:12                                │
│               (current verse elapsed)                      │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Functional requirements:**

- **~30 vertical bars** across the width. Height driven by microphone amplitude in real-time
- **Data source**: `record` package's `onAmplitudeChanged` stream (if available). Fallback: `Timer.periodic(100ms)` polling amplitude. Ultimate fallback for MVP: random values while recording
- Bar heights interpolate smoothly to new amplitude values (100ms, `linear`)
- **Verse timer**: Center-below the waveform. Shows current verse elapsed time. Resets to `00:00` on each verse advance. Format: `MM:SS`. Monospace font
- **Fixed height**: 80px total (60px bars + 20px timer)
- **When not recording** (Preview state): Bars flatten to minimum height (2px). Timer shows playback position instead of recording time
- **When idle** (before first verse starts or during save dialog): Bars at minimum height, timer at `00:00`

**Implementation approach:**

```
class WaveformVisualizer extends StatefulWidget:
    // Uses a CustomPainter that draws N bars
    // Listens to a Stream<double> for amplitude updates
    // Each bar height = max(minHeight, amplitude * maxHeight)
    // Uses AnimatedList or direct CustomPainter.repaint()
    // Timer runs via Timer.periodic(Duration(seconds: 1))
```

---

### ZONE 5 — ACTION AREA

```
              ╭──────────────────────╮
              │      NEXT   ▶        │    ← Primary CTA
              ╰──────────────────────╯

              Recite, then tap Next       ← Helper text

     ╭────────────╮            ╭────────────╮
     │  🔄 Redo   │            │  ▶ Preview │  ← Secondary actions
     ╰────────────╯            ╰────────────╯
```

#### Primary Button — NEXT / FINISH

| Property | NEXT (verses 1..N-1) | FINISH (last verse) |
|----------|---------------------|---------------------|
| Text | `NEXT   ▶` | `FINISH   ✓` |
| Icon | `Icons.arrow_forward` (trailing) | `Icons.check` (trailing) |
| Emphasis | Standard elevated button | Slightly larger, stronger shadow, subtle bounce entry animation (scale 1.0→1.05→1.0, 300ms, `elasticOut`) |

**On NEXT tap:**
1. Disable button (prevent double-tap — 500ms debounce via `_isProcessing` flag)
2. Stop recording for current verse
3. Save audio file → create `VerseAudio` object → append to `recordedVerses[]`
4. Fill progress block (animation)
5. `currentVerseIndex++`
6. Animate verse transition (slide left, 300ms)
7. Reset verse timer to `00:00`
8. Auto-start recording for next verse
9. Re-enable button

**On FINISH tap:**
1. Disable button
2. Stop recording for last verse
3. Save audio file → create `VerseAudio` object → append to `recordedVerses[]`
4. Fill last progress block (animation)
5. Stop session timer
6. Show Save Dialog (State D)

#### Helper Text

| State | Text |
|-------|------|
| Normal verse, recording | `Recite, then tap Next` |
| Last verse, recording | `Final verse! Tap to save.` |
| After Redo | `Re-recording... Tap Next when done` |
| During Preview | `Previewing... Tap to resume recording` |

#### Secondary Buttons — Redo & Preview

| Button | Icon | Label | Behavior |
|--------|------|-------|----------|
| 🔄 Redo | `Icons.refresh` | `Redo` | Stop recording → delete current verse's temp audio file → reset verse timer to `00:00` → flatten waveform → auto-start NEW recording for **SAME** verse. Does NOT go back to previous verses. Forward-only preserved |
| ▶ Preview | `Icons.play_arrow` | `Preview` | Stop recording temporarily → play back current verse's audio file → button text changes to `⏸ Stop Preview` → when playback ends OR user taps Stop Preview → stop playback → re-record same verse (simplest: delete old file, start fresh recording). Preview does NOT advance |

- Both buttons visible on ALL verses (including verse 1)
- Preview is **disabled** (greyed out) if current verse has no audio yet (< ~1 second of recording)
- During Preview playback: NEXT/FINISH button is disabled
- Style: `OutlinedButton`, side-by-side, centered, 24px gap between them

---

## 7. REDO & PREVIEW — DETAILED SUB-FLOWS

### 7.1 Redo Flow

```
USER TAPS [🔄 Redo]
  │
  ├─→ Stop current recording for this verse
  ├─→ Get the temp audio file path for this verse
  ├─→ Delete file from disk
  ├─→ If this verse was already in recordedVerses[] (edge case):
  │     └─→ Remove it
  ├─→ Reset verse timer to 00:00
  ├─→ Flatten waveform to minimum
  ├─→ Update helper text: "Re-recording... Tap Next when done"
  └─→ Auto-start NEW recording for SAME verse (new file path)
```

**Important**: Redo ONLY affects the **current** verse. It does NOT navigate back. Forward-only.

### 7.2 Preview Flow

```
USER TAPS [▶ Preview]
  │
  ├─→ Stop/pause recording temporarily
  ├─→ Waveform flattens to minimum
  ├─→ [▶ Preview] button text → [⏸ Stop Preview]
  ├─→ NEXT/FINISH button → disabled
  ├─→ Play back current verse audio file via AudioPlayer
  ├─→ Verse timer shows playback position (not recording time)
  │
  ├─→ WHEN playback completes OR user taps [⏸ Stop Preview]:
  │     ├─→ Stop playback
  │     ├─→ Button reverts to [▶ Preview]
  │     ├─→ NEXT/FINISH button → re-enabled
  │     ├─→ Decision: re-record (simplest implementation)
  │     │     ├─→ Delete old audio file
  │     │     ├─→ Reset verse timer
  │     │     └─→ Auto-start fresh recording
  │     └─→ Helper text: "Recite, then tap Next"
  │
  └─→ Note: Preview does NOT advance to next verse
```

---

## 8. SAVE DIALOG — DETAILED SPECIFICATION

Triggered after the last verse is recorded (FINISH tap).

```
SAVE DIALOG CONTENT:
  │
  ├─→ Title: "✅ Complete!"
  ├─→ Summary stats:
  │     ├─→ 📖 {surah_name}
  │     ├─→ 📍 Verses {start}–{end}
  │     ├─→ ⏱️ {total_session_time} total
  │     └─→ 🎙️ {verse_count} verses recorded
  │
  ├─→ Text input field:
  │     ├─→ Label: "Name your recording"
  │     ├─→ Default value: "Session {N}" (auto-increment based on existing recordings)
  │     ├─→ Auto-focused, keyboard opens
  │     └─→ Max length: 50 characters
  │
  ├─→ [💾 SAVE] button:
  │     ├─→ Build Recording object:
  │     │     {
  │     │       id: uuid_v4(),
  │     │       chunkId: currentChunk.id,
  │     │       name: userInputName,
  │     │       createdAt: DateTime.now(),
  │     │       verseFiles: recordedVerses[],
  │     │       totalDurationMs: sum(all verse durations)
  │     │     }
  │     ├─→ Persist via recordingRepository.save(recording)
  │     ├─→ Update chunk status to "inProgress" (if was "notStarted")
  │     └─→ Navigate to /home?chunk={chunkId}
  │
  └─→ [🗑️ DISCARD] text button:
        ├─→ Show inline confirmation: "Are you sure? Audio will be deleted."
        ├─→ If confirmed:
        │     ├─→ Delete ALL verse audio files from disk
        │     └─→ Navigator.pop() (back to wherever user came from)
        └─→ If cancelled: remain on dialog
```

**Dialog animations:**
- Appears with fade + scale from 0.9→1.0 (300ms, `easeOut`)
- Dimmed background at 60% opacity

---

## 9. AUDIO RECORDING — TECHNICAL SPECIFICATION

| Property | Value |
|----------|-------|
| **Package** | `record: ^5.0.4` |
| **Encoder** | `AudioEncoder.aacLc` (AAC-LC) |
| **Bit Rate** | 128,000 bps |
| **Sample Rate** | 44,100 Hz |
| **File Format** | `.m4a` |
| **File Naming** | `verse_{millisecondsSinceEpoch}.m4a` |
| **Storage Location** | `getApplicationDocumentsDirectory()` |
| **Permissions** | Microphone (request on page load, required to proceed) |
| **Amplitude Stream** | `_recorder.onAmplitudeChanged` → drive waveform. Fallback: timer-based random for MVP |

**Recording service interface:**

```
class RecordingService:
    AudioRecorder _recorder
    String? _currentFilePath

    start():
        directory = await getApplicationDocumentsDirectory()
        _currentFilePath = '{directory}/verse_{timestamp}.m4a'
        await _recorder.start(
            RecordConfig(
                encoder: AudioEncoder.aacLc,
                bitRate: 128000,
                sampleRate: 44100,
            ),
            path: _currentFilePath,
        )

    stop() → String:
        await _recorder.stop()
        return _currentFilePath!

    dispose():
        await _recorder.dispose()
```

---

## 10. ANIMATION TABLE

| Animation | Trigger | Duration | Curve | Implementation |
|-----------|---------|----------|-------|----------------|
| Verse slide transition | NEXT/FINISH tap | 300ms | `easeInOut` | `AnimatedSwitcher` with `SlideTransition` — old slides out left, new slides in from right |
| Progress block fill | Verse recorded | 200ms | `easeOut` | Color wipe left→right on the block |
| Recording dot pulse | Continuous while recording | 1000ms loop | `easeInOut` | Red dot opacity 0.3→1.0→0.3 |
| Waveform bars | Real-time amplitude | 100ms | `linear` | Bar heights interpolate to new amplitude values |
| Verse timer tick | Every second | Instant | — | `Timer.periodic(Duration(seconds: 1))` |
| FINISH button emphasis | Reaching last verse | 300ms | `elasticOut` | Scale 1.0→1.05→1.0 (subtle bounce) |
| Save dialog appear | After FINISH tap | 300ms | `easeOut` | `showDialog` with fade + scale 0.9→1.0 |
| Redo reset | Redo tapped | 200ms | `easeOut` | Waveform bars shrink to minimum, timer fades to `00:00` |
| Preview transition | Preview tapped | 200ms | `easeOut` | Button label crossfade `Preview` → `Stop Preview` |

---

## 11. STATE VARIABLES

Track these in a `ConsumerStatefulWidget`:

```
class _RecordPageState:
    // Chunk data
    Chunk _chunk
    List<Verse> _verses

    // Recording progress
    int _currentVerseIndex = 0
    List<VerseAudio> _recordedVerses = []

    // Recording state
    bool _isRecording = false
    bool _isPreviewing = false
    bool _isProcessing = false       // debounce flag for NEXT

    // Timers
    Duration _sessionElapsed = Duration.zero
    Duration _verseElapsed = Duration.zero
    Timer? _sessionTimer
    Timer? _verseTimer

    // Computed
    bool get _isLastVerse → _currentVerseIndex == _verses.length - 1
    bool get _hasRecordedAny → _recordedVerses.isNotEmpty
    bool get _canPreview → _verseElapsed > Duration(seconds: 1)
```

---

## 12. EDGE CASES

| Scenario | Handling |
|----------|----------|
| **Microphone permission denied** | Show dialog: "Microphone access is required to record your recitation." → [Open Settings] or [Go Back]. Go Back pops the page |
| **Chunk has only 1 verse** | NEXT never shown. Page shows FINISH immediately. Redo and Preview still available |
| **User closes app mid-recording** | `dispose()` cancels timers, stops recorder. Partial files remain orphaned on disk. Add cleanup logic on next app launch: scan for orphan files in recordings directory not referenced by any Recording entity |
| **Storage full** | Catch write errors from `recorder.stop()`. Show snackbar: "Not enough storage space. Free up space and try again." Stop recording gracefully |
| **Very long verse** | Verse display wrapped in `SingleChildScrollView` inside the `Expanded` area |
| **Recording with no sound** | No validation — user might be silently reading or testing. Do not reject silent recordings |
| **Rapid NEXT tapping** | Debounce: `_isProcessing = true` for 500ms after each tap. Button visually disabled during processing |
| **System interruption** (phone call, notification) | `record` package handles OS-level interruptions. On resume, recording continues or a new segment starts. Session timer continues; verse timer may need reset if interrupted |
| **Return without saving** | All temp files deleted. No orphaned data |
| **Duplicate recording names** | Allow duplicates — differentiated by creation date and ID |

---

## 13. DATA OUTPUT

When the user completes and saves, the following entity is persisted:

```
Recording {
    id: "a1b2c3d4-uuid",
    chunkId: "1-chunk-0",
    name: "Morning Session 1",
    createdAt: "2025-07-15T08:30:00.000Z",
    verseFiles: [
        { verseNumber: 1, filePath: "/data/.../verse_1721034600000.m4a", durationMs: 3500 },
        { verseNumber: 2, filePath: "/data/.../verse_1721034603500.m4a", durationMs: 4200 },
        { verseNumber: 3, filePath: "/data/.../verse_1721034607700.m4a", durationMs: 3800 },
        { verseNumber: 4, filePath: "/data/.../verse_1721034611500.m4a", durationMs: 5100 },
        { verseNumber: 5, filePath: "/data/.../verse_1721034616600.m4a", durationMs: 6200 },
        { verseNumber: 6, filePath: "/data/.../verse_1721034622800.m4a", durationMs: 4700 },
        { verseNumber: 7, filePath: "/data/.../verse_1721034627500.m4a", durationMs: 8900 }
    ],
    totalDurationMs: 36400
}
```

Each verse = independent `.m4a` file. The Home Page playback engine uses these individual files for its nested verse-by-verse repetition loop.

---

## 14. FILE & FOLDER STRUCTURE (suggested)

```
lib/features/recording/
├── record_page.dart                  // Main StatefulWidget — assembles zones
├── widgets/
│   ├── recording_header_bar.dart     // Zone 1 — ✕ + surah info + session timer
│   ├── progress_track.dart           // Zone 2 — verse blocks
│   ├── verse_display.dart            // Zone 3 — single verse card
│   ├── waveform_visualizer.dart      // Zone 4 — amplitude bars + timer
│   ├── recording_action_area.dart    // Zone 5 — NEXT/FINISH + Redo + Preview
│   ├── save_dialog.dart              // Save dialog modal
│   └── cancel_confirmation.dart      // Cancel confirmation dialog
├── providers/
│   └── recording_state.dart          // Riverpod state management
└── services/
    └── recording_service.dart        // Mic recording wrapper (record package)
```

---

## 15. RECORDING FLOW — COMPLETE PSEUDOCODE

```
function initRecordPage(chunkId):
    chunk = await chunkRepository.get(chunkId)
    verses = await quranRepository.getVerses(chunk.surahNumber, chunk.startVerse, chunk.endVerse)
    currentVerseIndex = 0
    recordedVerses = []

    hasMicPermission = await recorder.hasPermission()
    if NOT hasMicPermission:
        showMicPermissionDialog()
        return

    startSessionTimer()
    startVerseTimer()
    startRecording(verses[0])


function startRecording(verse):
    filePath = '{appDocDir}/verse_{timestamp}.m4a'
    await recorder.start(config, path: filePath)
    isRecording = true
    updateWaveform(recorder.amplitudeStream)


function handleNext():
    if isProcessing: return       // debounce
    isProcessing = true

    // 1. Stop recording
    filePath = await recorder.stop()
    isRecording = false

    // 2. Save verse audio
    verseAudio = VerseAudio(
        verseNumber: verses[currentVerseIndex].number,
        filePath: filePath,
        durationMs: verseElapsed.inMilliseconds
    )
    recordedVerses.add(verseAudio)

    // 3. Animate progress block fill
    animateProgressBlock(currentVerseIndex)

    // 4. Check if last verse
    if currentVerseIndex == verses.length - 1:
        stopSessionTimer()
        showSaveDialog()
    else:
        // 5. Advance to next verse
        currentVerseIndex++
        resetVerseTimer()
        animateVerseTransition()

        // 6. Auto-start recording
        startRecording(verses[currentVerseIndex])

    isProcessing = false


function handleRedo():
    // Stop and delete current verse audio
    filePath = await recorder.stop()
    deleteFile(filePath)
    isRecording = false

    // Reset
    resetVerseTimer()
    flattenWaveform()
    updateHelperText("Re-recording... Tap Next when done")

    // Re-start for same verse
    startRecording(verses[currentVerseIndex])


function handlePreview():
    // Stop recording
    tempFilePath = await recorder.stop()
    isRecording = false
    isPreviewing = true
    flattenWaveform()

    // Play back
    audioPlayer.setFilePath(tempFilePath)
    audioPlayer.play()

    // Wait for completion or user stop
    await audioPlayer.onComplete() OR userTapsStopPreview

    // After preview: re-record
    audioPlayer.stop()
    isPreviewing = false
    deleteFile(tempFilePath)
    resetVerseTimer()
    updateHelperText("Recite, then tap Next")
    startRecording(verses[currentVerseIndex])


function handleSave(name):
    recording = Recording(
        id: uuid(),
        chunkId: chunk.id,
        name: name,
        createdAt: now(),
        verseFiles: recordedVerses,
        totalDurationMs: recordedVerses.sum(v => v.durationMs)
    )
    await recordingRepository.save(recording)
    await chunkRepository.updateStatus(chunk.id, "inProgress")
    navigateTo('/home?chunk={chunk.id}')


function handleDiscard():
    for each verseAudio in recordedVerses:
        deleteFile(verseAudio.filePath)
    navigateBack()


function handleClose():
    if recordedVerses.isNotEmpty:
        confirmed = await showConfirmDialog(
            "Discard recording?",
            "You've recorded {recordedVerses.length} of {verses.length} verses."
        )
        if confirmed:
            // Also delete audio for current in-progress verse
            if isRecording:
                filePath = await recorder.stop()
                deleteFile(filePath)
            handleDiscard()
    else:
        if isRecording:
            await recorder.stop()
            // delete the in-progress file too
        navigateBack()


function dispose():
    sessionTimer?.cancel()
    verseTimer?.cancel()
    recorder.dispose()
```

---

## 16. CRITICAL REQUIREMENTS CHECKLIST

⚠️ **Must implement ALL of these. Missing any = build failure.**

| # | Requirement | Priority |
|---|-------------|----------|
| 1 | **Per-verse files** — each verse = separate `.m4a`, NOT one continuous recording | 🔴 CRITICAL |
| 2 | **Auto-start** — recording begins the instant a verse appears | 🔴 CRITICAL |
| 3 | **Auto-stop** — recording stops the instant NEXT/FINISH is tapped | 🔴 CRITICAL |
| 4 | **Forward-only** — no Previous button, no going back | 🔴 CRITICAL |
| 5 | **Single primary button** — "NEXT ▶" morphs to "FINISH ✓" on last verse | 🔴 CRITICAL |
| 6 | **No bottom nav** — full-screen immersive experience | 🔴 CRITICAL |
| 7 | **No unnecessary headers** — no "Record Your Recitation" decorative text | 🔴 CRITICAL |
| 8 | **Save dialog after FINISH** — naming + summary + Save/Discard | 🔴 CRITICAL |
| 9 | **Cancel ✕ with confirmation** — if verses were recorded, confirm discard | 🔴 CRITICAL |
| 10 | **Redo re-records same verse** — does not go to previous verse | 🟡 HIGH |
| 11 | **Preview plays back current verse** — then resumes recording | 🟡 HIGH |
| 12 | **Waveform visualization** — live audio amplitude feedback | 🟡 HIGH |
| 13 | **Progress track** — visual blocks showing recorded vs remaining | 🟡 HIGH |
| 14 | **Session timer** — total elapsed in header, runs continuously | 🟡 HIGH |
| 15 | **Verse timer** — per-verse elapsed below waveform, resets on advance | 🟡 HIGH |
| 16 | **300ms verse transitions** — smooth slide animations | 🟡 HIGH |
| 17 | **Debounced NEXT** — `_isProcessing` flag, 500ms lockout | 🟢 MEDIUM |
| 18 | **Microphone permission handling** — graceful denial UX | 🟢 MEDIUM |
| 19 | **System back = ✕ Close** — same confirmation flow | 🟢 MEDIUM |
| 20 | **Orphan file cleanup** — delete temp files on discard/cancel | 🟢 MEDIUM |

---

## 17. IMPLEMENTATION ORDER

Build in this sequence:

```
PHASE 1: Page Shell
  ├─→ RecordPage scaffold (full-screen, no bottom nav)
  ├─→ Zone 1: Header bar (static — ✕ + surah info)
  ├─→ Zone 3: Verse display (static — show first verse)
  ├─→ Zone 5: Action area (NEXT button, static)
  └─→ Basic navigation: push from Home, pop back

PHASE 2: Recording Engine
  ├─→ RecordingService wrapper around `record` package
  ├─→ Auto-start on page load (with mic permission request)
  ├─→ Stop + save on NEXT tap
  ├─→ Per-verse file storage
  └─→ recordedVerses[] accumulation

PHASE 3: Verse Flow
  ├─→ currentVerseIndex increment on NEXT
  ├─→ Verse transition animation (slide, 300ms)
  ├─→ NEXT → FINISH button morph on last verse
  ├─→ Auto-start recording for next verse
  └─→ Debounce (_isProcessing flag)

PHASE 4: Progress & Timers
  ├─→ Zone 2: Progress track (blocks fill on advance)
  ├─→ Session timer (header, continuous)
  ├─→ Verse timer (waveform area, resets)
  └─→ Recording dot pulse animation

PHASE 5: Waveform
  ├─→ Zone 4: Waveform visualizer CustomPainter
  ├─→ Amplitude stream from recorder
  ├─→ Bar height interpolation
  └─→ Flatten on pause/preview

PHASE 6: Redo & Preview
  ├─→ Redo: stop → delete → restart same verse
  ├─→ Preview: stop → playback → re-record
  ├─→ Helper text updates
  └─→ Preview disable when no audio

PHASE 7: Save & Cancel
  ├─→ Save dialog (naming + summary + persist)
  ├─→ Cancel confirmation dialog
  ├─→ File cleanup on discard
  ├─→ Navigate back to Home with chunk param
  └─→ System back handler (WillPopScope / PopScope)

PHASE 8: Polish
  ├─→ All animations (block fill, dot pulse, button bounce)
  ├─→ Edge case handling (1-verse chunk, storage full, etc.)
  ├─→ Loading states
  └─→ Accessibility (Semantics widgets for screen readers)
```

---

**END OF PROMPT — Implement this specification completely. This page is full-screen with NO bottom navigation bar. Each verse MUST produce a separate `.m4a` file. The flow is strictly forward-only. Do not add a Previous button.** ✅
