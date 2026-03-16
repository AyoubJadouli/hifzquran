# Hifz Quran (React Web App)

Hifz Quran is a Quran memorization app focused on **voice-based learning**:

- record your own recitation,
- replay by verse/chunk,
- repeat with custom controls,
- and track progress over time.

The app is built to support practical daily Hifz routines with a modern UX and multilingual SEO-ready marketing pages.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Data & Storage](#data--storage)
- [Routing](#routing)
- [SEO Setup](#seo-setup)
- [Domain Strategy](#domain-strategy)
- [Known Notes](#known-notes)
- [Documentation](#documentation)

---

## Overview

**Product positioning:** Quran memorization app (Hifz) with a clear differentiation:

> **Memorize Quran with your own voice.**

Instead of only consuming generic reciter audio, learners recite, record, and replay their own voice. This learning flow is aligned with memory-research-informed principles like:

- self-generation,
- vocal production,
- repetition,
- and active recall.

---

## Key Features

### Core Hifz Workflow
- Surah browsing and chunk-based practice
- Verse-by-verse recitation recording
- Playback with speed, repetition, and gap controls
- Shuffle and auto-advance options

### Learning & Tracking
- Chunk status tracking (`not_started`, `in_progress`, `completed`)
- Session recording metadata
- Progress dashboard (listening time, streaks, completion)

### Quran Content
- Arabic recitation source with **Warsh-first strategy** in data layer
- Translation/transliteration support with language-based loading
- Caching for faster repeat access

### Marketing / SEO
- Multilingual landing pages
- Auto language redirect
- Canonical + alternate hreflang links
- `robots.txt` and `sitemap.xml`

---

## Tech Stack

- **Frontend:** React 18 + Vite
- **Routing:** `react-router-dom`
- **Styling:** Tailwind CSS
- **UI primitives:** Radix-based UI components
- **Animation:** Framer Motion
- **Charts:** Recharts
- **Icons:** Lucide
- **Storage:** Browser `localStorage` (entity-like local data layer)

---

## Project Structure

```txt
src/
  App.jsx
  components/
    home/
    record/
    ui/
    quranData.jsx
    localData.jsx
    SeoHead.jsx
  pages/
    Home.jsx
    Surahs.jsx
    SurahDetail.jsx
    Record.jsx
    Progress.jsx
    AppSettings.jsx
    marketing/
      LandingPage.jsx
      FeaturesPage.jsx
      AboutPage.jsx
      MarketingLayout.jsx
      LocaleRedirect.jsx
      i18n.js
public/
  robots.txt
  sitemap.xml
docs/
  react-native-migration-guide.md
  ui-ux-design-language-spec.md
```

---

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Start development server

```bash
npm run dev
```

### 3) Build for production

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

---

## Available Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview build locally
- `npm run lint` — run ESLint
- `npm run lint:fix` — auto-fix lint issues
- `npm run typecheck` — TypeScript/jsconfig check

---

## Data & Storage

### Local entities

The app uses a local entity abstraction backed by `localStorage`:

- `Chunk`
- `Recording`
- `UserSettings`

### Quran data layer

`src/components/quranData.jsx` handles:

- Surah list fetching
- Surah verse fetching with language support
- Translation/transliteration handling
- Cache in memory + localStorage
- Full prefetch helper for offline-oriented setup

---

## Routing

### Marketing routes

- `/:lang` (landing)
- `/:lang/features`
- `/:lang/about`

Language is normalized from browser locale and redirected via `LocaleRedirect`.

### App routes

- `/app/Home`
- `/app/Surahs`
- `/app/SurahDetail`
- `/app/Record`
- `/app/Progress`
- `/app/AppSettings`

Legacy route redirects are included for compatibility.

---

## SEO Setup

Implemented:

- Dynamic page title and meta description (`SeoHead`)
- Dynamic canonical URLs
- `hreflang` alternates per localized route
- Global SEO metas in `index.html`
- `public/robots.txt`
- `public/sitemap.xml`

Primary SEO direction:

- Focus keyword cluster around:
  - `hifz quran app`
  - `quran memorization app`
  - `memorize quran with your own voice`
  - `quran memorization by listening`

---

## Domain Strategy

Recommended canonical marketing host:

- `https://hifzquran.los.ma`

Current project SEO links can be adjusted to your final canonical host before deployment if needed.

---

## Known Notes

- Build warns about large bundle chunks (non-blocking). Consider route-level code splitting later.
- This web app is local-storage-first; production sync/cloud backup is not yet implemented.
- Audio/recording behavior depends on browser permissions.

---

## Documentation

- React Native migration guide:
  - `docs/react-native-migration-guide.md`
- UI/UX design language spec:
  - `docs/ui-ux-design-language-spec.md`

---

## License

Private/internal project unless specified otherwise by repository owner.
