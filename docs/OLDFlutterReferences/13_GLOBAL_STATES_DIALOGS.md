# 13 — GLOBAL STATES, DIALOGS & ERROR HANDLING
---

# SCREEN 9 — SURAH PICKER MODAL

(Used by the Surah Quick-Selector on Home Page — specified in the Home Page spec, repeated here for completeness.)

Full-height bottom sheet with search, filter, and tap-to-select. See Home Page spec §5.2 for details.

---

---

# SCREEN 10 — RECORDING MANAGEMENT DIALOGS

## 10.1 Rename Recording

```
╭──────────────────────────────────╮
│                                  │
│   ✏️  Rename Recording           │
│                                  │
│   ╭──────────────────────────╮   │
│   │ Morning Session 1    |   │   │
│   ╰──────────────────────────╯   │
│                                  │
│   ╭────────╮  ╭────────╮        │
│   │ Cancel │  │  Save  │        │
│   ╰────────╯  ╰────────╯        │
│                                  │
╰──────────────────────────────────╯
```

## 10.2 Delete Recording Confirmation

```
╭──────────────────────────────────╮
│                                  │
│   🗑️  Delete Recording?          │
│                                  │
│   "Morning Session 1"            │
│   Al-Fatihah · Chunk 1 (1-7)    │
│   03:24 · 7 verse files          │
│                                  │
│   This cannot be undone.         │
│                                  │
│   ╭────────╮  ╭────────╮        │
│   │ Cancel │  │ Delete │        │
│   ╰────────╯  ╰────────╯        │
│                                  │
╰──────────────────────────────────╯
```

## 10.3 Export Recording

Triggers system share sheet with all `.m4a` verse files for the selected recording (or zipped if multiple).

---

---

# SCREEN 11 — GLOBAL EMPTY & ERROR STATES

## 11.1 Empty States

| Screen | Empty State |
|--------|-------------|
| **Home (no chunks)** | Centered: "Pick a surah to start your Hifz journey" + [📖 Browse Surahs] button |
| **Home (chunk, no recordings)** | Normal verse display but Play disabled. Helper: "⚠ No recordings — tap 🎤 to record" |
| **Surahs (impossible unless data corrupt)** | "Quran data missing. Please reinstall the app." |
| **Surah Detail (generating)** | Spinner + "Generating chunks..." (1-2 seconds) |
| **Library Recordings** | Large mic icon + "No recordings yet. Start by picking a surah and recording!" + button |
| **Library Bookmarks** | Star icon + "No bookmarks yet. Double-tap any verse to bookmark it." |
| **Progress (no data)** | Ring at 0% + "Start memorizing to see your progress here!" + button |

## 11.2 Error States

| Error | Display |
|-------|---------|
| **Audio file missing** | Snackbar: "Recording file not found. It may have been deleted." Red. |
| **Microphone permission denied** | Full-screen: "Microphone access is required" + "Open Settings" button. |
| **Storage full** | Snackbar: "Not enough storage. Free up space to continue recording." |
| **JSON parse error** | Full-screen: "Unable to load Quran data. Please reinstall." |
| **Generic error** | Snackbar: "Something went wrong. Please try again." + retry button. |
| **Network error (future sync)** | Snackbar: "No internet connection. Changes saved locally." |

## 11.3 Loading States

All loading states use **shimmer skeleton** animations (not spinners) matching the layout shape of the content being loaded:

| Screen | Shimmer Shape |
|--------|---------------|
| **Home** | Header bar shimmer + 3 verse card rectangles |
| **Surahs List** | 8 surah card skeletons |
| **Surah Detail** | Header card shimmer + 4 chunk card skeletons |
| **Progress** | Ring circle shimmer + 6 stat card rectangles |
| **Library** | 5 recording row skeletons |

---

---

# CROSS-CUTTING FEATURES

## A. Dark Mode

All screens support dark mode via `ThemeData.dark()`:

| Light | Dark |
|-------|------|
| `background: #FDF8F3` (cream) | `background: #121212` |
| `surface: #FFFFFF` | `surface: #1E1E1E` |
| `textPrimary: #1A1A1A` | `textPrimary: #E0E0E0` |
| `textSecondary: #6B7280` | `textSecondary: #9CA3AF` |
| `primary: #0D5C46` (unchanged) | `primary: #0D5C46` (unchanged) |
| `accent: #D4AF37` (unchanged) | `accent: #D4AF37` (unchanged) |

Arabic text always uses the same color weight for readability.

## B. Accessibility

| Feature | Implementation |
|---------|----------------|
| **Semantics** | All interactive elements have `Semantics` labels. |
| **Font scaling** | Respects system font size. Arabic font has separate user-controlled size. |
| **Contrast** | All text meets WCAG 2.1 AA contrast (4.5:1 minimum). |
| **Screen reader** | Verse cards announce: "Verse {N}, {Arabic text}" in screen reader mode. |
| **Reduce motion** | Respects `MediaQuery.disableAnimations`. Replaces animations with instant transitions. |
| **Touch targets** | Minimum 44×44 tap targets per Material guidelines. |

## C. Haptic Feedback

| Action | Haptic |
|--------|--------|
| Chunk navigation (◀/▶) | Light impact |
| Verse change during playback | Selection tick |
| Recording Next/Finish tap | Medium impact |
| Bookmark (double-tap) | Success notification |
| Delete confirmation | Warning notification |

## D. Notifications (Background Playback)

When audio is playing in the background, show a persistent notification:

```
┌──────────────────────────────────────────────────────┐
│  🕌 Hifz Companion                         10:34 AM  │
│  ▶ Al-Fatihah · Verse 4 of 7                         │
│  Morning Session 1 · 1.0x                             │
│  [⏸ Pause]  [⏹ Stop]  [⏭ Next Verse]                │
└──────────────────────────────────────────────────────┘
```

---

## FINAL SCREEN INVENTORY

| # | Screen | Route | Status |
|---|--------|-------|--------|
| 1 | Home Page (Player/Reader) | `/home` | ✅ Separate spec |
| 2 | Recording Page | `/record/:chunkId` | ✅ Separate spec |
| 3 | Surahs List | `/surahs` | ✅ This document |
| 4 | Surah Detail | `/surah/:id` | ✅ This document |
| 5 | Settings | `/settings` | ✅ This document |
| 6 | Progress & Stats | `/progress` | ✅ This document |
| 7 | Library | `/library` | ✅ This document (NEW) |
| 8 | Onboarding (5 screens) | First launch | ✅ This document (NEW) |
| 9 | Splash Screen | App startup | ✅ This document (NEW) |
| 10 | Mini Player | Overlay on all pages | ✅ This document (NEW) |
| 11 | Surah Picker Modal | Modal from Home | ✅ This document |
| 12 | Recording Dialogs | Modals | ✅ This document |
| 13 | Empty & Error States | All pages | ✅ This document |
