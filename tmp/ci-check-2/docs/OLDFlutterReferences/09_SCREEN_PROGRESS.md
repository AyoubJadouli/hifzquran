# 09 — PROGRESS & STATS PAGE
# SCREEN 4 — PROGRESS & STATS PAGE

## Route: `/progress`

## 4.1 PURPOSE

Comprehensive analytics dashboard. Shows global memorization progress, listening habits, streaks, and predictive completion estimates.

## 4.2 ASCII WIREFRAME

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│ ┌─ APP BAR ──────────────────────────────────────────────┐   │
│ │              📊  Your Progress                          │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│ ┌─ TAB BAR ──────────────────────────────────────────────┐   │
│ │    [Overview]     [Surahs]     [History]     [Goals]    │   │
│ │       ━━━                                               │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│                    ══ OVERVIEW TAB ══                         │
│                                                              │
│ ┌─ HERO PROGRESS RING ──────────────────────────────────┐    │
│ │                                                        │    │
│ │                 ╭──────────────╮                        │    │
│ │                ╱    ████████    ╲                       │    │
│ │               │   ██        ██   │                     │    │
│ │               │  █            █  │                     │    │
│ │               │  █   11.9%    █  │                     │    │
│ │               │  █            █  │                     │    │
│ │               │   ██        ██   │                     │    │
│ │                ╲    ████████    ╱                       │    │
│ │                 ╰──────────────╯                        │    │
│ │                                                        │    │
│ │               742 of 6236 verses                       │    │
│ │                 8 surahs active                         │    │
│ │                                                        │    │
│ └────────────────────────────────────────────────────────┘    │
│                                                              │
│ ┌─ STATS GRID (2×3) ────────────────────────────────────┐    │
│ │                                                        │    │
│ │  ╭──────────────────╮  ╭──────────────────╮            │    │
│ │  │  🎧 Listening     │  │  🔥 Streak       │            │    │
│ │  │                   │  │                  │            │    │
│ │  │  47h 23m          │  │  12 days         │            │    │
│ │  │  +3h this week    │  │  Best: 34 days   │            │    │
│ │  ╰──────────────────╯  ╰──────────────────╯            │    │
│ │                                                        │    │
│ │  ╭──────────────────╮  ╭──────────────────╮            │    │
│ │  │  ⚡ Velocity      │  │  📅 Est. Finish  │            │    │
│ │  │                   │  │                  │            │    │
│ │  │  8.3 verses/day   │  │  Mar 2028        │            │    │
│ │  │  ▲ +1.2 vs avg    │  │  ~2 years left   │            │    │
│ │  ╰──────────────────╯  ╰──────────────────╯            │    │
│ │                                                        │    │
│ │  ╭──────────────────╮  ╭──────────────────╮            │    │
│ │  │  📝 Recordings   │  │  💾 Storage      │            │    │
│ │  │                   │  │                  │            │    │
│ │  │  128 total        │  │  247 MB used     │            │    │
│ │  │  12h 47m audio    │  │  ~1.2 GB free    │            │    │
│ │  ╰──────────────────╯  ╰──────────────────╯            │    │
│ │                                                        │    │
│ └────────────────────────────────────────────────────────┘    │
│                                                              │
│ ┌─ WEEKLY ACTIVITY ──────────────────────────────────────┐    │
│ │                                                        │    │
│ │  This Week                        32 verses · 4h 12m   │    │
│ │                                                        │    │
│ │  ┌────┬────┬────┬────┬────┬────┬────┐                  │    │
│ │  │ M  │ T  │ W  │ T  │ F  │ S  │ S  │                  │    │
│ │  │    │    │    │    │    │    │    │                  │    │
│ │  │ ▓▓ │ ▓▓ │ ▓▓ │    │ ▓▓ │ ▓▓ │    │                  │    │
│ │  │ ▓▓ │ ▓▓ │ ▓▓ │    │ ▓▓ │ ▓▓ │    │                  │    │
│ │  │ ▓▓ │ ▓▓ │ ▓▓ │    │    │ ▓▓ │    │                  │    │
│ │  │ ▓▓ │    │ ▓▓ │    │    │    │    │                  │    │
│ │  │ 12 │ 8  │ 15 │ 0  │ 5  │ 10 │ —  │  (verses/day)   │    │
│ │  └────┴────┴────┴────┴────┴────┴────┘                  │    │
│ │                                                        │    │
│ └────────────────────────────────────────────────────────┘    │
│                                                              │
│ ┌─ MONTHLY HEATMAP (GitHub-style) ──────────────────────┐    │
│ │                                                        │    │
│ │  Last 3 Months                                         │    │
│ │                                                        │    │
│ │  ░░▓░░▓▓░░░▓▓▓░░▓░░▓▓▓▓░░░▓▓                         │    │
│ │  ░▓▓░░▓▓▓░░▓▓▓▓░▓▓░░▓▓▓░░░▓▓                         │    │
│ │  ░▓▓▓░▓▓▓▓░▓▓▓▓▓▓▓▓░▓▓▓▓░░▓▓                         │    │
│ │  ░░▓▓░░▓▓▓░░▓▓▓░▓▓▓░░▓▓▓░░▓▓                         │    │
│ │                                                        │    │
│ │  ░ = 0   ▒ = 1-3   ▓ = 4+  verses                     │    │
│ │                                                        │    │
│ └────────────────────────────────────────────────────────┘    │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│   🏠        📖        📑        📊        ⚙️               │
│                                  ━━                          │
└──────────────────────────────────────────────────────────────┘
```

## 4.3 TAB DETAILS

### Tab: Overview (shown above)

See wireframe above. All stats, ring, weekly bars, monthly heatmap.

### Tab: Surahs

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                    ══ SURAHS TAB ══                           │
│                                                              │
│  ┌─ SURAH PROGRESS GRID ────────────────────────────────┐    │
│  │                                                       │    │
│  │  Showing: [All ▼]  Sort: [Progress ▼]                 │    │
│  │                                                       │    │
│  │  ╭───────────╮ ╭───────────╮ ╭───────────╮            │    │
│  │  │ 1         │ │ 114       │ │ 113       │            │    │
│  │  │ الفاتحة   │ │ الناس    │ │ الفلق    │            │    │
│  │  │           │ │           │ │           │            │    │
│  │  │ ████████  │ │ ██████░░  │ │ █████░░░  │            │    │
│  │  │   100%    │ │    75%    │ │    60%    │            │    │
│  │  │    ✅     │ │    🔄     │ │    🔄     │            │    │
│  │  ╰───────────╯ ╰───────────╯ ╰───────────╯            │    │
│  │                                                       │    │
│  │  ╭───────────╮ ╭───────────╮ ╭───────────╮            │    │
│  │  │ 112       │ │ 2         │ │ 3         │            │    │
│  │  │ الاخلاص  │ │ البقرة   │ │ آل عمران │            │    │
│  │  │           │ │           │ │           │            │    │
│  │  │ ███░░░░░  │ │ █░░░░░░░  │ │ ░░░░░░░░  │            │    │
│  │  │    40%    │ │    12%    │ │     0%    │            │    │
│  │  │    🔄     │ │    🔄     │ │    ⬚     │            │    │
│  │  ╰───────────╯ ╰───────────╯ ╰───────────╯            │    │
│  │                                                       │    │
│  │  ... (grid continues, 3 columns)                      │    │
│  │                                                       │    │
│  └───────────────────────────────────────────────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

- 3-column grid of mini surah progress cards
- Each card: surah number, Arabic name, mini progress bar, percentage, status icon
- Tap a card → navigate to `/surah/{id}`
- Filter: All, In Progress, Completed, Not Started
- Sort: Progress, Mushaf order, Verse count

### Tab: History

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                    ══ HISTORY TAB ══                          │
│                                                              │
│  ┌─ ACTIVITY TIMELINE ──────────────────────────────────┐    │
│  │                                                       │    │
│  │  ── Today ──────────────────────────────────────      │    │
│  │                                                       │    │
│  │  🎧 10:34 AM   Played Al-Fatihah (1-7)               │    │
│  │                 15 min · 3x chunk repeat · 1.0x       │    │
│  │                                                       │    │
│  │  🎤 09:15 AM   Recorded Al-Baqarah (1-7)             │    │
│  │                 "Morning Session 4" · 03:42            │    │
│  │                                                       │    │
│  │  ── Yesterday ──────────────────────────────────      │    │
│  │                                                       │    │
│  │  🎧 08:22 PM   Played An-Nas (1-6)                   │    │
│  │                 45 min · ∞ chunk repeat · 0.75x       │    │
│  │                                                       │    │
│  │  🎧 02:15 PM   Played Al-Fatihah (1-7)               │    │
│  │                 20 min · 5x chunk repeat · 1.0x       │    │
│  │                                                       │    │
│  │  ✅ 02:00 PM   Marked Al-Fatihah chunk 1 complete     │    │
│  │                                                       │    │
│  │  ── Mar 13 ─────────────────────────────────────      │    │
│  │                                                       │    │
│  │  ...                                                  │    │
│  │                                                       │    │
│  └───────────────────────────────────────────────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

- Chronological timeline of all user actions
- Each entry: icon (🎧 play, 🎤 record, ✅ complete) + time + description + metadata
- Tap a timeline entry → navigate to that chunk
- Filterable: All, Playback only, Recording only, Milestones only

### Tab: Goals

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                    ══ GOALS TAB ══                            │
│                                                              │
│  ┌─ DAILY GOAL ─────────────────────────────────────────┐    │
│  │                                                       │    │
│  │  Today's Target:  10 verses                           │    │
│  │                                                       │    │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░  7/10  (70%)       │    │
│  │                                                       │    │
│  │  🔥 3 more verses to hit your goal!                   │    │
│  │                                                       │    │
│  │                               [ ✏️ Edit Goal ]        │    │
│  └───────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─ WEEKLY GOAL ────────────────────────────────────────┐    │
│  │                                                       │    │
│  │  This Week:  50 verses (35 listening hours)           │    │
│  │                                                       │    │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░  32/50  (64%)      │    │
│  │                                                       │    │
│  └───────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─ MILESTONES ─────────────────────────────────────────┐    │
│  │                                                       │    │
│  │  ✅  First Recording           Completed Jan 15       │    │
│  │  ✅  10 Verses                  Completed Jan 18       │    │
│  │  ✅  100 Verses                 Completed Feb 22       │    │
│  │  ✅  First Surah Complete       Completed Mar 01       │    │
│  │  🔲  500 Verses                 68% (742/500)  ← next │    │
│  │  🔲  Juz' Amma (Juz 30)        42%                    │    │
│  │  🔲  1000 Verses                                      │    │
│  │  🔲  10 Surahs Complete                               │    │
│  │  🔲  Half Quran (3118 verses)                         │    │
│  │  🔲  Full Quran (6236 verses)                 🕌       │    │
│  │                                                       │    │
│  └───────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─ PREDICTION ENGINE ──────────────────────────────────┐    │
│  │                                                       │    │
│  │  Based on your pace (8.3 verses/day):                 │    │
│  │                                                       │    │
│  │  📅  500 verses      ~30 days    (Apr 2026)           │    │
│  │  📅  Juz 30           ~4 months   (Jul 2026)          │    │
│  │  📅  Half Quran       ~10 months  (Jan 2027)          │    │
│  │  📅  Full Quran       ~22 months  (Mar 2028)          │    │
│  │                                                       │    │
│  │  💡 Increasing to 12 verses/day would cut             │    │
│  │     completion time by 7 months!                      │    │
│  │                                                       │    │
│  └───────────────────────────────────────────────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 4.4 STATS CALCULATION FORMULAS

| Stat | Formula |
|------|---------|
| **Completion %** | `(chunks with status=completed × versesPerChunk) / 6236 × 100` (approximate, accounting for overlap) |
| **Streak** | Count consecutive calendar days with at least one playback or recording session. Reset to 0 if a day is missed. |
| **Best Streak** | Maximum streak ever achieved. Persisted in Hive. |
| **Velocity** | `totalVersesCompleted / totalActiveDays` (days with activity, not calendar days) |
| **Est. Completion** | `(6236 - versesCompleted) / velocity` → add to today's date |
| **Total Listening** | Sum of all playback session durations (tracked per session, stored in Hive) |

---
