# 12 — MINI PLAYER (Persistent Overlay)
# SCREEN 8 — MINI PLAYER (Persistent Bottom Overlay) (NEW)

## 8.1 PURPOSE

When the user navigates away from Home while audio is playing, a **mini player** appears above the bottom nav on ALL other pages. Allows pause/resume/stop without returning to Home.

## 8.2 ASCII WIREFRAME

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│         (any non-Home page content above)                    │
│                                                              │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ ┌─ MINI PLAYER ──────────────────────────────────────────┐   │
│ │                                                        │   │
│ │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │   │
│ │                                                        │   │
│ │  ♫ Al-Fatihah · V4 · 2/3 rep   ╭──╮  ╭──╮  ╭──╮      │   │
│ │     0:47 / 1:52                 │⏸ │  │⏹ │  │↗ │      │   │
│ │                                 ╰──╯  ╰──╯  ╰──╯      │   │
│ │                                pause  stop  expand     │   │
│ │                                                        │   │
│ └────────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────┤
│   🏠        📖        📑        📊        ⚙️               │
└──────────────────────────────────────────────────────────────┘
```

| Element | Details |
|---------|---------|
| **Progress Bar** | Thin `LinearProgressIndicator` (3px) at top of mini player. Shows position within current verse. |
| **Info** | `♫ {surahName} · V{verseNum} · {verseRep}/{totalVerseRep} rep` — 13sp, single line, truncated with ellipsis. |
| **Time** | `{elapsed} / {total}` — 11sp monospace. |
| **⏸ Pause/▶ Resume** | Toggle button. 36×36. |
| **⏹ Stop** | Stops playback entirely. Mini player disappears. 36×36. |
| **↗ Expand** | Navigates to Home Page with current chunk loaded and playback continuing. 36×36. |
| **Tap anywhere** | Same as Expand — navigates to Home. |
| **Swipe down** | Minimizes mini player (stays as a tiny pill with just ⏸/▶). |
| **Height** | 64px (compact). |
| **Visibility** | Only when `playbackState.isPlaying || playbackState.isPaused` AND current route ≠ `/home`. |

---
