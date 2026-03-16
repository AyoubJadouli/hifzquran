# 15 — CROSS-CUTTING CONCERNS

## 1. DARK MODE

All screens support dark mode via `ThemeData`:

| Token | Light | Dark |
|-------|-------|------|
| `background` | `#FDF8F3` (cream) | `#121212` |
| `surface` | `#FFFFFF` | `#1E1E1E` |
| `textPrimary` | `#1A1A1A` | `#E0E0E0` |
| `textSecondary` | `#6B7280` | `#9CA3AF` |
| `primary` | `#0D5C46` (emerald) | `#0D5C46` (unchanged) |
| `accent` | `#D4AF37` (gold) | `#D4AF37` (unchanged) |
| `error` | `#DC2626` | `#EF4444` |
| `success` | `#059669` | `#10B981` |

- Arabic text always uses high-contrast color for readability
- Theme controlled via settings: `light`, `dark`, `system` (default: system)
- Switch via `ThemeMode` in `MaterialApp`

---

## 2. RTL SUPPORT

- All Arabic text wrapped in `Directionality(textDirection: TextDirection.rtl, ...)`
- Navigation arrows inverted: Previous chunk = right-pointing arrow (→), Next chunk = left-pointing arrow (←)
- Verse scroller swipe direction respects natural Arabic reading flow
- Chunk slide animations: "next" slides content to the RIGHT (not left)
- Applied globally where Arabic content is displayed

---

## 3. ACCESSIBILITY

| Feature | Implementation |
|---------|----------------|
| **Semantics** | All interactive elements have `Semantics` labels |
| **Font scaling** | Respects system font size. Arabic font has separate user-controlled size (settings) |
| **Contrast** | All text meets WCAG 2.1 AA contrast (4.5:1 minimum) |
| **Screen reader** | Verse cards announce: "Verse {N}, {Arabic text}" |
| **Reduce motion** | Respects `MediaQuery.disableAnimations`. Replaces animations with instant transitions |
| **Touch targets** | Minimum 44×44 tap targets per Material guidelines |
| **Focus order** | Logical tab order: header → content → controls |

---

## 4. HAPTIC FEEDBACK

| Action | Haptic |
|--------|--------|
| Chunk navigation (◀/▶) | Light impact |
| Verse change during playback | Selection tick |
| Recording NEXT/FINISH tap | Medium impact |
| Bookmark (double-tap) | Success notification |
| Delete confirmation | Warning notification |
| Redo tap | Light impact |

Use `HapticFeedback.lightImpact()`, `HapticFeedback.mediumImpact()`, `HapticFeedback.selectionClick()` from `flutter/services.dart`.

---

## 5. NOTIFICATIONS (Background Playback)

```
┌──────────────────────────────────────────────────────┐
│  🕌 Hifz Companion                         10:34 AM  │
│  ▶ Al-Fatihah · Verse 4 of 7                         │
│  Morning Session 1 · 1.0x                             │
│  [⏸ Pause]  [⏹ Stop]  [⏭ Next Verse]                │
└──────────────────────────────────────────────────────┘
```

- Android: `MediaStyle` notification via `audio_service`
- iOS: Control Center integration automatic via `audio_service`
- Updates on every verse change (title: `{surahName} · Verse {N} of {total}`)
- Disappears when playback stops

---

## 6. MASTER ANIMATION TABLE

| Animation | Screen | Trigger | Duration | Curve | Implementation |
|-----------|--------|---------|----------|-------|----------------|
| Verse zoom in | Home | Verse becomes current | 300ms | `easeOut` | `AnimatedContainer` + `Matrix4.scale(0.85→1.0)` + `AnimatedOpacity(0.4→1.0)` |
| Verse zoom out | Home | Verse becomes adjacent | 300ms | `easeOut` | `Matrix4.scale(1.0→0.85)` + `AnimatedOpacity(1.0→0.4)` |
| Chunk slide | Home | ◀/▶ chunk nav | 300ms | `easeInOut` | `PageController.animateToPage()` or `AnimatedSwitcher` + `SlideTransition` |
| Auto-scroll | Home | Verse changes during playback | 400ms | `easeInOutCubic` | `PageController.animateToPage()` |
| Status bar appear | Home | Playback starts | 200ms | `easeOut` | `AnimatedSlide` height 0→actual |
| Status bar disappear | Home | Playback stops | 200ms | `easeIn` | Reverse |
| Active glow | Home | Verse playing | 2s loop | `easeInOut` | Border opacity pulse 20%→40%→20% |
| Pause breathe | Home | Verse paused | 3s loop | `easeInOut` | Border opacity 10%→30%→10% |
| Chunk dots | Home | Chunk changes | 200ms | `easeOut` | Dot fill/unfill |
| Recording label swap | Home | Recording selected | 150ms | `easeOut` | `AnimatedSwitcher` fade |
| Play button morph | Home | Play↔Pause↔Stop | 200ms | `easeOut` | Icon rotation + color |
| Sleep timer fade | Home | Timer expires | 3000ms | `linear` | Volume 1.0→0.0 |
| Font size pinch | Home | Pinch gesture | Real-time | — | `GestureDetector` + `onScaleUpdate` |
| Verse slide (recording) | Record | NEXT/FINISH tap | 300ms | `easeInOut` | `AnimatedSwitcher` + `SlideTransition` |
| Progress block fill | Record | Verse recorded | 200ms | `easeOut` | Color wipe left→right |
| Recording dot pulse | Record | While recording | 1000ms loop | `easeInOut` | Opacity 0.3→1.0→0.3 |
| Waveform bars | Record | Real-time amplitude | 100ms | `linear` | Bar height interpolation |
| FINISH button emphasis | Record | Last verse reached | 300ms | `elasticOut` | Scale 1.0→1.05→1.0 |
| Save dialog appear | Record | After FINISH | 300ms | `easeOut` | Fade + scale 0.9→1.0 |
| Splash logo | Splash | App launch | 300ms | `easeOut` | Fade in |
| Splash spinner | Splash | After logo | 200ms | `easeOut` | Appear |
| Onboarding page | Onboard | Swipe/Next | 300ms | `easeInOut` | `PageView` slide |
| Mini player appear | Shell | Navigate away from Home while playing | 200ms | `easeOut` | Slide up |
| Mini player disappear | Shell | Stop playback or return to Home | 200ms | `easeIn` | Slide down |
| Shimmer skeleton | All | Loading state | Continuous | `linear` | Shimmer gradient sweep |

---

## 7. LOADING STATES (Shimmer Skeletons)

All loading states use shimmer skeleton animations (NOT spinners):

| Screen | Shimmer Shape |
|--------|---------------|
| Home | Header bar shimmer + 3 verse card rectangles |
| Surahs List | 8 surah card skeletons |
| Surah Detail | Header card shimmer + 4 chunk card skeletons |
| Progress | Ring circle shimmer + 6 stat card rectangles |
| Library | 5 recording row skeletons |

Use `flutter_animate` package shimmer effect or custom `ShimmerLoading` widget.

---

## 8. ISLAMIC DESIGN PATTERNS

- Subtle geometric patterns as backgrounds (2-5% opacity)
- Implement via `CustomPainter` drawing repeating Islamic star/geometric motifs
- Applied to: Surah Detail header, Onboarding backgrounds, Splash screen
- Toggleable in Settings (default: ON)
- Pattern complexity: keep simple to avoid performance impact on older devices

---

## 9. RESPONSIVE LAYOUT

| Breakpoint | Layout Adjustment |
|-----------|-------------------|
| Phone portrait (<600px) | Default layout, single column |
| Phone landscape | Verse card expands horizontally, controls compact, status bar single-line |
| Tablet portrait (600-900px) | Wider verse cards, 2-column stats grid, more padding |
| Tablet landscape (>900px) | Side-by-side: verse scroller + playback controls. Surahs in 2-column grid |
| Web (>1200px) | Max-width container (800px), centered. Sidebar navigation option |

Use `MediaQuery`, `LayoutBuilder`, and `Adaptive` widgets from Flutter.
