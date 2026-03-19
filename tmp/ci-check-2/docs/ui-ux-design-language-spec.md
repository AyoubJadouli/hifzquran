# React Hifz — UI/UX Design Language Spec (with ASCII Schemas)

This document explains the app’s visual language in design-jargon terms: color system, typographic hierarchy, spacing rhythm, component morphology, interaction patterns, and screen structure.

It also includes ASCII wire schemas with practical dimensions so designers and developers can align implementation.

---

## 1) Design Intent / Brand Expression

**Positioning:** premium spiritual utility app for Quran memorization.

**Aesthetic direction:**

- Neo-classical Islamic luxury (green + gold palette)
- Ornamental but performance-friendly
- High-contrast, low-cognitive-load controls
- Touch-first ergonomics with clear primary actions

**Emotional goals:** serenity, reverence, momentum, trust.

---

## 2) Core Visual Tokens

## 2.1 Color System (semantic)

### Primary Brand Spectrum

- Deep Emerald: `#0B5B3B`, `#0E5B3D`, `#0A412B`
- Gold Core: `#D4AF37`
- Gold Highlight: `#F2D675`
- Gold Dark: `#8E6820`

### Functional Semantics

- **Background Base:** deep green gradients (luxury/night mood)
- **Accent/CTA:** metallic gold gradients
- **Success/Completion:** rich green (`#2B8A3E` family)
- **Warning/Discard:** copper-red (`#A92E16`, `#C44A1A`)
- **Neutral text over dark:** warm ivory (`#F0E6C8` range)

### Suggested token naming

- `color.bg.canvas`
- `color.bg.header`
- `color.surface.card`
- `color.accent.gold.500`
- `color.accent.gold.300`
- `color.text.primary`
- `color.text.secondary`
- `color.feedback.success`
- `color.feedback.warning`

---

## 2.2 Typography

Primary type pairing:

- **Arabic display/body:** Amiri (serif, classical)
- **UI controls/meta:** Inter (sans-serif, modern)

Hierarchy model:

- H1/Hero: 22–28 px
- H2/Section: 15–18 px
- Body: 12–14 px
- Caption/meta: 9–11 px

Usage strategy:

- Arabic scripture receives larger optical weight + looser leading.
- Action labels use uppercase/semibold Inter for decisiveness.

---

## 2.3 Spacing + Rhythm

Baseline grid: **4 px** unit.

Common spacing increments:

- 4 / 8 / 12 / 16 / 20 / 24 / 32

Corner radii style:

- Pills/chips: 9999 (full)
- Standard card: 16 px
- Elevated dialog/card: 22–24 px

Shadows:

- Soft ambient + subtle inset highlights to emulate metallic/parchment depth.

---

## 3) UI Morphology (component language)

## 3.1 Buttons

### Primary CTA

- Height: ~52 px
- Radius: 14–16 px
- Fill: gold gradient or success green gradient
- Treatment: top gloss overlay + drop shadow

### Secondary buttons

- Height: ~40–44 px
- Border: 1.5 px gold
- State variant: neutral parchment / dark-active / green utility

---

## 3.2 Cards / Surfaces

### Verse card

- Outer metallic frame + inner parchment panel
- Arabic center-aligned with generous line-height
- Decorative medallion for verse index
- Corner ornaments (low-opacity diamonds)

### Stat and list cards

- Rounded 16 px
- Thin gold-border tint
- Decorative micro-ornament for brand consistency

---

## 3.3 Navigation

- Bottom nav anchored for thumb reach
- Icon + micro-label
- Active state: brighter gold + tiny dot indicator
- Record screen intentionally hides tab nav (focus mode)

---

## 4) UX Interaction Model

## 4.1 Core loops

1. Select surah/chunk
2. Record recitation verse-by-verse
3. Playback with repetition controls
4. Track progress and iterate

## 4.2 Feedback patterns

- Clear loading states (spinner + contextual message)
- Animated transitions between verses/chunks
- Distinct visual priority for primary action (“Next/Finish/Play”)

## 4.3 Cognitive ergonomics

- Single dominant CTA per section
- Optional actions grouped and visually demoted
- Readability-first scripture presentation

---

## 5) Screen Architecture + ASCII Schemas

Assume baseline viewport: **390 x 844** (typical mobile portrait).

> Dimensions below are practical targets, not strict constraints.

## 5.1 Home Screen (Playback-Focused)

```txt
┌──────────────────────────────────────┐  y=0
│ Header / Chunk Identity              │  h≈88
│ [Surah] [Verse range] [chunk nav]    │
├──────────────────────────────────────┤
│ Surah Selector Pill                  │  h≈56
├──────────────────────────────────────┤
│                                      │
│   Verse Stack / Scroll Area          │  h≈420-470
│   (active verse emphasis)            │
│                                      │
├──────────────────────────────────────┤
│ Playback Status Strip                │  h≈44
├──────────────────────────────────────┤
│ Primary Control Bar                  │  h≈76
│ [Record] [Play/Pause/Stop] [Menu]    │
├──────────────────────────────────────┤
│ Bottom Nav (global)                  │  h≈64
└──────────────────────────────────────┘  y=844
```

Key ratios:

- Content dominance in middle zone (~55% height)
- Controls in lower ergonomic zone (~20%)

---

## 5.2 Record Screen (Focus Mode)

```txt
┌──────────────────────────────────────┐
│ Top Utility Bar                      │ h≈56
│ [Close] [Surah+Range] [Timer Pill]   │
├──────────────────────────────────────┤
│ Verse Progress Track                 │ h≈28
├──────────────────────────────────────┤
│ Verse Counter Label                  │ h≈24
├──────────────────────────────────────┤
│                                      │
│  Hero Verse Card (Parchment)         │ h≈350-420
│  + Integrated Waveform zone          │
│                                      │
├──────────────────────────────────────┤
│ Primary CTA (Next/Finish)            │ h≈52
│ Helper text                           │ h≈20
│ Secondary actions (Redo/Preview)     │ h≈44
└──────────────────────────────────────┘
```

Interaction priority:

- Next/Finish is always most visually dominant.
- Redo and Preview remain accessible but secondary.

---

## 5.3 Surahs List Screen

```txt
┌──────────────────────────────────────┐
│ Decorative Header + Search           │ h≈150
├──────────────────────────────────────┤
│ Scroll List of Surah Cards           │
│ ┌──────────────────────────────────┐ │
│ │ # Medallion | Names | Type | >  │ │ h≈70 ea
│ └──────────────────────────────────┘ │
│ ...                                  │
└──────────────────────────────────────┘
```

---

## 5.4 Surah Detail Screen

```txt
┌──────────────────────────────────────┐
│ Header + Progress Bar                │ h≈170
├──────────────────────────────────────┤
│ Chunk Cards list                     │
│ ┌──────────────────────────────────┐ │
│ │ status | verse range | mic | play│ │ h≈74 ea
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

---

## 5.5 Progress Screen

```txt
┌──────────────────────────────────────┐
│ Title / Subtitle                     │ h≈64
├──────────────────────────────────────┤
│ Circular Completion Ring             │ h≈200
├──────────────────────────────────────┤
│ KPI Cards Grid (2x2)                 │ h≈190
├──────────────────────────────────────┤
│ Surah Bars + Charts + Summary        │ variable scroll
└──────────────────────────────────────┘
```

---

## 6) Motion Language

Motion principles:

- Short transitions (200–280 ms)
- Ease-in-out for content shifts
- Low-amplitude movement (x/y 20–40 px) for contextual continuity

Use cases:

- Chunk transitions (horizontal fade/slide)
- Verse state changes
- Press/tap micro-feedback via scale (0.94–0.98)

---

## 7) Accessibility Guidelines

- Maintain minimum touch target: **44x44 px**
- Ensure text contrast for small labels ≥ WCAG AA where possible
- Avoid relying on color-only state indicators (icons + labels + position)
- Keep arabic text scalable and avoid clipping at larger font settings

---

## 8) Platform Adaptation Notes (for React Native)

- Keep tokenized color and spacing constants in a design-tokens module.
- Rebuild component primitives (`Button`, `Card`, `Pill`, `Header`) natively.
- Preserve visual hierarchy before adding ornamental effects.
- Prioritize smooth scrolling and low-latency touch feedback over heavy effects.

---

## 9) Quick Token Starter (implementation-friendly)

```txt
Spacing: 4,8,12,16,20,24,32
Radius: 10,12,16,22,9999
Button heights: 40 / 44 / 52
Header heights: 56 / 88 / 150
Nav height: 64
```

Color core:

```txt
emerald-900: #0A412B
emerald-700: #0E5B3D
gold-500:    #D4AF37
gold-300:    #F2D675
copper-700:  #A92E16
ivory-100:   #F8F3E8
```

---

## 10) Summary

This app’s design system is a **luxury devotional UI** combining:

- classical Arabic typographic tone,
- tactile gold-on-emerald action hierarchy,
- and mobile-first ergonomic control zoning.

The schemas and dimensions above can be used as a handoff baseline for redesign, React Native porting, or Figma componentization.
