# 07 — SURAH DETAIL PAGE
# SCREEN 2 — SURAH DETAIL PAGE

## Route: `/surah/:id`

## 2.1 PURPOSE

Shows all chunks for a single surah. The user sees their progress chunk-by-chunk, can jump to any chunk for reading/playback, or start recording. **Auto-generates chunks on first visit.**

## 2.2 PAGE STATES

| State | Description |
|-------|-------------|
| **GENERATING** | First visit — chunks being generated. Show spinner + "Generating chunks..." |
| **DEFAULT** | Chunks list visible |
| **REGENERATING** | User changed chunk settings and tapped "Regenerate". Confirmation dialog → progress. |

## 2.3 ASCII WIREFRAME

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│ ┌─ APP BAR ──────────────────────────────────────────────┐   │
│ │                                                        │   │
│ │  ← Back        الفاتحة — Al-Fatihah            ╭───╮  │   │
│ │                 The Opening                     │ ⋮ │  │   │
│ │                                                 ╰───╯  │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│ ┌─ SURAH HEADER CARD ────────────────────────────────────┐   │
│ │                                                        │   │
│ │  ╭──────────────────────────────────────────────────╮  │   │
│ │  │                                                  │  │   │
│ │  │          ﷽                                       │  │   │
│ │  │                                                  │  │   │
│ │  │    📖  7 verses  ·  Meccan  ·  Revelation #5     │  │   │
│ │  │                                                  │  │   │
│ │  │    ─────────────────────────────────────────     │  │   │
│ │  │                                                  │  │   │
│ │  │    Progress:  ▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░  57%         │  │   │
│ │  │    4 of 7 chunks completed                       │  │   │
│ │  │    12 recordings · 47min total                   │  │   │
│ │  │                                                  │  │   │
│ │  │    Chunk Config:  7 verses · 2 overlap           │  │   │
│ │  │                              [🔄 Regenerate]     │  │   │
│ │  │                                                  │  │   │
│ │  ╰──────────────────────────────────────────────────╯  │   │
│ │                                                        │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│ ┌─ CHUNKS LIST ──────────────────────────────────────────┐   │
│ │                                                        │   │
│ │  ╭────────────────────────────────────────────────╮    │   │
│ │  │                                                │    │   │
│ │  │  ✅  Chunk 1  ·  Verses 1–7                    │    │   │
│ │  │      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  Completed     │    │   │
│ │  │      3 recordings                              │    │   │
│ │  │      Last played: 2h ago                       │    │   │
│ │  │                                                │    │   │
│ │  │      ╭───────╮  ╭───────╮  ╭───────╮          │    │   │
│ │  │      │▶ Read │  │🎤 Rec │  │▶ Play │          │    │   │
│ │  │      ╰───────╯  ╰───────╯  ╰───────╯          │    │   │
│ │  │                                                │    │   │
│ │  ╰────────────────────────────────────────────────╯    │   │
│ │                                                        │   │
│ │  ╭────────────────────────────────────────────────╮    │   │
│ │  │                                                │    │   │
│ │  │  🔄  Chunk 2  ·  Verses 6–12                   │    │   │
│ │  │      ▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░  In Progress    │    │   │
│ │  │      1 recording                               │    │   │
│ │  │      Last played: 1d ago                       │    │   │
│ │  │                                                │    │   │
│ │  │      ╭───────╮  ╭───────╮  ╭───────╮          │    │   │
│ │  │      │▶ Read │  │🎤 Rec │  │▶ Play │          │    │   │
│ │  │      ╰───────╯  ╰───────╯  ╰───────╯          │    │   │
│ │  │                                                │    │   │
│ │  ╰────────────────────────────────────────────────╯    │   │
│ │                                                        │   │
│ │  ╭────────────────────────────────────────────────╮    │   │
│ │  │                                                │    │   │
│ │  │  ⬚  Chunk 3  ·  Verses 11–17                   │    │   │
│ │  │      ░░░░░░░░░░░░░░░░░░░░░░░░  Not Started     │    │   │
│ │  │      0 recordings                               │    │   │
│ │  │                                                │    │   │
│ │  │      ╭───────╮  ╭───────╮                      │    │   │
│ │  │      │▶ Read │  │🎤 Rec │    (no Play — 0 rec) │    │   │
│ │  │      ╰───────╯  ╰───────╯                      │    │   │
│ │  │                                                │    │   │
│ │  ╰────────────────────────────────────────────────╯    │   │
│ │                                                        │   │
│ │  ... (more chunks)                                     │   │
│ │                                                        │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│   🏠        📖        📑        📊        ⚙️               │
└──────────────────────────────────────────────────────────────┘
```

## 2.4 COMPONENT DETAILS

### Surah Header Card

| Element | Details |
|---------|---------|
| **Bismillah** | ﷽ in decorative Amiri Quran, 24sp, centered. Subtle Islamic geometric pattern background via `CustomPainter` at 3% opacity. |
| **Metadata** | Verse count, revelation type, revelation order. 14sp caption. |
| **Progress Bar** | Full-width `LinearProgressIndicator`. Shows `{completed}/{total} chunks completed`. |
| **Recording Stats** | Total recordings across all chunks + total recorded duration. |
| **Chunk Config** | Shows current chunk size + overlap. |
| **🔄 Regenerate** | Small outlined button. Tapping shows confirmation: "This will reset all chunk progress for this surah. Recordings will be kept. Continue?" → regenerates chunks with current settings. |

### Chunk Card

| Element | Details |
|---------|---------|
| **Status Icon** | ✅ completed (green), 🔄 in progress (gold), ⬚ not started (grey). Left-aligned, 24×24. |
| **Title** | `Chunk {N} · Verses {start}–{end}` — 16sp bold. |
| **Progress** | `LinearProgressIndicator` — calculated as: completed if marked, in-progress if has recordings, not started otherwise. |
| **Recording Count** | `{N} recordings` — 12sp caption. |
| **Last Activity** | `Last played: {timeAgo}` — 12sp caption. Hidden if never accessed. |
| **Action Buttons** | Row of small outlined buttons: |

| Button | Icon | Label | Action |
|--------|------|-------|--------|
| **▶ Read** | `Icons.menu_book` | `Read` | Navigate to `/home?chunk={chunkId}` — opens chunk in reader mode (no auto-play). |
| **🎤 Rec** | `Icons.mic` | `Rec` | Navigate to `/record/{chunkId}` — starts recording session. |
| **▶ Play** | `Icons.play_arrow` | `Play` | Navigate to `/home?chunk={chunkId}&autoplay=true` — opens chunk and immediately starts playback with last-used recording. **Hidden if 0 recordings.** |

### Overflow Menu (⋮ in App Bar)

| Option | Action |
|--------|--------|
| **Play All Chunks** | Starts sequential playback of ALL chunks in this surah, auto-advancing. Navigates to Home. |
| **Export All Recordings** | Exports all recordings for this surah as a zip of `.m4a` files. |
| **Reset Progress** | Marks all chunks as "not started" (keeps recordings). |
| **Delete All Recordings** | Confirmation → deletes all audio files + metadata for this surah. |
| **Share Surah Link** | Copies a shareable deep link (future feature placeholder). |

### Regenerate Chunks Confirmation Dialog

```
┌──────────────────────────────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░ (dimmed) ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                              │
│         ╭──────────────────────────────────────╮             │
│         │                                      │             │
│         │   🔄 Regenerate Chunks?              │             │
│         │                                      │             │
│         │   Current: 7 verses, 2 overlap       │             │
│         │   New:     5 verses, 1 overlap       │             │
│         │                                      │             │
│         │   ⚠ Chunk progress will reset.       │             │
│         │   Recordings will be preserved       │             │
│         │   but may no longer align with       │             │
│         │   new chunk boundaries.              │             │
│         │                                      │             │
│         │   ╭──────────╮  ╭──────────────╮     │             │
│         │   │  Cancel  │  │  Regenerate  │     │             │
│         │   ╰──────────╯  ╰──────────────╯     │             │
│         │                                      │             │
│         ╰──────────────────────────────────────╯             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---
