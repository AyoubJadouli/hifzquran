# 06 — SURAHS LIST PAGE
# SCREEN 1 — SURAHS LIST PAGE

## Route: `/surahs`

## 1.1 PURPOSE

Browse all 114 surahs of the Quran. Search, filter, and navigate to any surah's chunks. This is the primary discovery surface — how users choose what to memorize next.

## 1.2 PAGE STATES

| State | Description |
|-------|-------------|
| **DEFAULT** | Full list visible, no filter applied |
| **SEARCHING** | Keyboard open, list filtered by query |
| **FILTERED** | Filter chips active (revelation type, status) |
| **LOADING** | Initial data load — shimmer skeleton |

## 1.3 ASCII WIREFRAME

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│ ┌─ APP BAR ──────────────────────────────────────────────┐   │
│ │                                                        │   │
│ │              📖  Browse Surahs                         │   │
│ │                                                        │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│ ┌─ SEARCH BAR ───────────────────────────────────────────┐   │
│ │                                                        │   │
│ │  🔍  Search by name, number, or transliteration...     │   │
│ │                                                        │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│ ┌─ FILTER CHIPS (horizontal scroll) ─────────────────────┐   │
│ │                                                        │   │
│ │  [All ✓]  [Meccan]  [Medinan]  [In Progress]  [Done]   │   │
│ │  [Not Started]  [Has Recordings]                       │   │
│ │                                                        │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│ ┌─ SORT BAR ─────────────────────────────────────────────┐   │
│ │  Sort:  [Mushaf Order ▼]     114 surahs · 6236 ayat    │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│ ╭────────────────────────────────────────────────────────╮   │
│ │                                                        │   │
│ │  ╭────╮                                                │   │
│ │  │ 1  │  الفاتحة  ·  Al-Fatihah                        │   │
│ │  │    │  The Opening                                   │   │
│ │  ╰────╯  7 verses  ·  Meccan  ·  Rev. #5              │   │
│ │                                                        │   │
│ │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  100%   ✅          │   │
│ │  3 recordings · Last: 2h ago                           │   │
│ │                                                        │   │
│ ├────────────────────────────────────────────────────────┤   │
│ │                                                        │   │
│ │  ╭────╮                                                │   │
│ │  │ 2  │  البقرة  ·  Al-Baqarah                         │   │
│ │  │    │  The Cow                                       │   │
│ │  ╰────╯  286 verses  ·  Medinan  ·  Rev. #87          │   │
│ │                                                        │   │
│ │  ▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░   12%   🔄          │   │
│ │  5 recordings · Last: 1d ago                           │   │
│ │                                                        │   │
│ ├────────────────────────────────────────────────────────┤   │
│ │                                                        │   │
│ │  ╭────╮                                                │   │
│ │  │ 3  │  آل عمران  ·  Aali Imran                       │   │
│ │  │    │  The Family of Imran                           │   │
│ │  ╰────╯  200 verses  ·  Medinan  ·  Rev. #89          │   │
│ │                                                        │   │
│ │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   0%    ⬚          │   │
│ │  No recordings                                         │   │
│ │                                                        │   │
│ ├────────────────────────────────────────────────────────┤   │
│ │                                                        │   │
│ │  ... (scrollable list continues)                       │   │
│ │                                                        │   │
│ ╰────────────────────────────────────────────────────────╯   │
│                                                              │
│ ┌─ FAB (Floating Action Button) ─────────────────────────┐   │
│ │                                          ╭───────────╮ │   │
│ │                                          │ 🎯 Resume │ │   │
│ │                                          ╰───────────╯ │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│   🏠        📖        📑        📊        ⚙️               │
│            Surahs                                            │
│             ━━                                               │
└──────────────────────────────────────────────────────────────┘
```

## 1.4 COMPONENT DETAILS

### Surah Card

| Element | Details |
|---------|---------|
| **Number Badge** | Square with rounded corners (8px), 44×44, `AppColors.primary` at 10% bg. Number centered in bold 18sp. Color-coded border-left: green (complete), gold (in progress), grey (not started). |
| **Arabic Name** | 18sp, Amiri font, `textPrimary`. |
| **English Name** | 16sp, Poppins medium, `textPrimary`. Same line as Arabic, separated by ` · `. |
| **English Meaning** | 13sp, Inter, `textSecondary`. Second line (e.g., "The Opening"). |
| **Metadata Line** | 12sp caption: `{totalVerses} verses · {revelationType} · Rev. #{revelationOrder}` |
| **Progress Bar** | `LinearProgressIndicator`, 4px height, rounded. Green fill for percentage of completed chunks. Shows `{N}%` text right-aligned. |
| **Status Icon** | ✅ completed, 🔄 in progress, ⬚ not started. |
| **Recording Info** | 12sp caption: `{N} recordings · Last: {timeAgo}`. Hidden if 0 recordings. |
| **On Tap** | Navigate to `/surah/{id}` (Surah Detail). |
| **On Long Press** | Quick actions popup: "Go to first chunk", "Record next chunk", "Mark as complete". |

### Search Bar

| Feature | Details |
|---------|---------|
| **Input** | `TextField` with `InputDecoration.prefixIcon: Icons.search`. |
| **Searches** | Arabic name, English name, transliteration, surah number. Case-insensitive. |
| **Debounce** | 200ms debounce on keystroke before filtering. |
| **Clear** | ✕ button appears when text is entered. |
| **Results Count** | Updates sort bar text: `"3 results"` when filtered. |

### Filter Chips

| Chip | Behavior |
|------|----------|
| **All** | Default selected. Clears all filters. |
| **Meccan** | Show only Meccan surahs (86 surahs). |
| **Medinan** | Show only Medinan surahs (28 surahs). |
| **In Progress** | Surahs with at least one chunk started but not all complete. |
| **Done** | Surahs where all chunks are completed. |
| **Not Started** | Surahs with zero chunks started. |
| **Has Recordings** | Surahs with at least one recording in any chunk. |
| **Multi-select** | Filters combine with AND logic: "Meccan" + "In Progress" = Meccan surahs in progress. |

### Sort Options

| Sort | Description |
|------|-------------|
| **Mushaf Order** (default) | Surah 1 → 114. |
| **Revelation Order** | Chronological order of revelation (Al-Alaq first). |
| **Progress (High→Low)** | Most complete surahs first. |
| **Progress (Low→High)** | Least complete first (to find what needs work). |
| **Verse Count (Short→Long)** | Shortest surahs first (easy wins). |
| **Verse Count (Long→Short)** | Longest first. |
| **Recently Active** | Surahs with most recent `lastAccessed` chunk. |

### Resume FAB

| Element | Details |
|---------|---------|
| **Visibility** | Only visible if a last-active chunk exists. |
| **Label** | `🎯 Resume` — extended FAB style. |
| **On Tap** | Navigate to `/home?chunk={lastActiveChunkId}`. |
| **Position** | Bottom-right, above bottom nav, floating. |

---
