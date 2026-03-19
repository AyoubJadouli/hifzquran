# 00 — PROJECT OVERVIEW

## 🕌 App Identity

- **Name**: Hifz Companion
- **Tagline**: Memorize the Quran effortlessly through passive listening
- **Platform**: Flutter (iOS + Android + Web PWA)
- **Stage**: MVP (v1.0)

---

## 💡 Core Philosophy

**Low-Effort Hifz Through Passive Listening**

The app enables effortless Quran memorization (Hifz) by allowing users to:

1. **Record** their own voice reciting selected chunks (user-defined groups of 1–N complete verses)
2. **Listen passively** throughout the day via headset/earbuds
3. **Internalize through repetition** — continuous playback embeds verses in memory with minimal active effort
4. **Achieve Hifz** through sustained exposure to their own recitation

**Key Principle**: Users don't actively study — they simply wear headphones and let their recorded recitations play repeatedly during daily activities (commuting, exercising, household tasks) until the Quran is completely memorized.

---

## 👤 Primary User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  FIRST LAUNCH                                                   │
│    │                                                            │
│    ├─→ Splash Screen (1.5s)                                     │
│    ├─→ Onboarding (5 screens: Welcome → How → Language →        │
│    │                          Starting Point → Ready!)          │
│    └─→ Home Page (loaded with first chunk)                      │
│                                                                 │
│  DAILY USAGE LOOP                                               │
│    │                                                            │
│    ├─→ App opens → Last active chunk loaded on Home Page        │
│    │                                                            │
│    ├─→ RECORD FLOW (occasional — when learning new content)     │
│    │     ├─→ Tap 🎤 Record on Home Page                        │
│    │     ├─→ Full-screen recording: 1 verse at a time           │
│    │     ├─→ NEXT → NEXT → ... → FINISH                        │
│    │     ├─→ Name recording → Save                              │
│    │     └─→ Return to Home (new recording auto-selected)       │
│    │                                                            │
│    └─→ LISTEN FLOW (daily — primary use case)                   │
│          ├─→ Select recording (or use last selected)            │
│          ├─→ Configure: speed, verse reps, chunk reps, ambience │
│          ├─→ Tap ▶ Play                                         │
│          ├─→ Lock screen / put phone in pocket                  │
│          ├─→ Audio plays for hours via nested repetition loops   │
│          ├─→ Lock screen controls: pause/resume/skip            │
│          └─→ Sleep timer or manual stop                         │
│                                                                 │
│  PROGRESS TRACKING                                              │
│    ├─→ Mark chunks as memorized                                 │
│    ├─→ View completion %, streaks, velocity                     │
│    ├─→ Prediction engine: "Full Quran by {date}"                │
│    └─→ Milestones & achievements                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Quran Data Facts

| Metric | Value |
|--------|-------|
| Total Surahs | 114 |
| Total Verses (Ayat) | 6,236 |
| Total Juz' (Parts) | 30 |
| Meccan Surahs | 86 |
| Medinan Surahs | 28 |
| Shortest Surah | Al-Kawthar (3 verses) |
| Longest Surah | Al-Baqarah (286 verses) |

**Minimum unit**: 1 complete ayah (verses are INDIVISIBLE — no splitting mid-verse)

---

## 🗺️ CURRENT SCOPE (v1.0 MVP)

### Screens to Build

| # | Screen | Route | Priority |
|---|--------|-------|----------|
| 1 | Home Page (Player/Reader) | `/home` | 🔴 CRITICAL |
| 2 | Recording Page | `/record/:chunkId` | 🔴 CRITICAL |
| 3 | Surahs List | `/surahs` | 🔴 CRITICAL |
| 4 | Surah Detail | `/surah/:id` | 🔴 CRITICAL |
| 5 | Settings | `/settings` | 🟡 HIGH |
| 6 | Progress & Stats | `/progress` | 🟡 HIGH |
| 7 | Library | `/library` | 🟡 HIGH |
| 8 | Onboarding (5 screens) | First launch only | 🟢 MEDIUM |
| 9 | Splash Screen | App startup | 🟢 MEDIUM |
| 10 | Mini Player | Overlay (non-Home) | 🟢 MEDIUM |

### Core Features (v1.0)

- Per-verse audio recording with auto-start/stop
- Nested repetition playback (verse reps × chunk reps)
- Background audio with lock screen controls
- Speed control (0.5x–2.0x) with pitch preservation
- Ambient sound mixing (rain, nature, white noise)
- Auto-chunk generation (configurable size + overlap)
- Verse zoom effect (current enlarged, adjacent faded)
- Chunk slide transitions with RTL support
- Settings persistence via Hive
- Progress tracking (completion %, streaks, velocity)
- Prediction engine (estimated completion date)
- Library management (rename, delete, export recordings)
- Bookmarks (double-tap verses)
- Sleep timer with volume fade-out
- Dark mode support

---

## 🔮 FUTURE SCOPE (v2.0+)

### Phase 2 — Cloud & Social

- Google OAuth authentication
- Cloud sync (FastAPI backend + PostgreSQL)
- Cross-device sync (progress + recordings + settings)
- Share recordings via links
- Import external audio (crop to match verses)

### Phase 3 — Intelligence

- AI-powered tajweed analysis (pronunciation feedback)
- Spaced repetition scheduler (SRS)
- Automated verse segmentation from continuous recordings
- Voice comparison (user vs. reference reciter)

### Phase 4 — Ecosystem

- Google Drive / iCloud backup
- Home screen widgets (progress + quick play)
- Siri Shortcuts / Google Assistant ("Play my current chunk")
- Calendar integration (goal reminders)
- Apple Watch / Wear OS companion (progress glance)

### Phase 5 — Advanced Audio

- Room acoustic effects (studio, hall, mosque, open space)
- Voice isolation / noise reduction
- EQ presets (clarity, warmth, brightness)
- Dynamic compression
- Custom reverb (decay time, wet/dry mix)
- DSP via native platform channels (Kotlin/Swift)

### Phase 6 — Content & Gamification

- Tafsir integration (commentary per verse)
- Revelation order study mode
- Serious games & achievements
- Leaderboards (opt-in)
- Daily challenges
- Multi-language translations (7+ languages)

---

## 📐 Design Language

- **Islamic luxury manuscript aesthetic** — emerald green, warm gold accents, cream backgrounds
- **Minimalist** — breathing layouts, generous padding, no visual clutter
- **Typography-first** — Arabic Uthmanic script is the hero element
- **Smooth animations** — 60fps target, 300ms standard transition duration
- **Immersive recording** — full-screen, no bottom nav, distraction-free
- **Ambient player** — verse auto-scroll, gold glow on active verse
- **RTL-aware** — all navigation arrows inverted for Arabic content flow
