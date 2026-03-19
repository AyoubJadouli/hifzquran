# 🕌 HIFZ COMPANION — Complete Project Specification Archive

> **For**: Coding Agent (Cline / Cursor / Aider / Claude Code)
> **Framework**: Flutter (Dart) · Riverpod · go_router · just_audio · audio_service · record
> **Read Order**: Start with `00_PROJECT_OVERVIEW.md`, then `01_ARCHITECTURE.md`, then screen specs in order.

---

## 📁 FILE INDEX

| # | File | Description | Read Priority |
|---|------|-------------|---------------|
| 00 | `00_PROJECT_OVERVIEW.md` | App vision, philosophy, user flow, roadmap (current + future) | 🔴 READ FIRST |
| 01 | `01_ARCHITECTURE.md` | Tech stack, folder structure, data models, providers, dependencies | 🔴 READ SECOND |
| 02 | `02_DATA_MODELS.md` | Complete Dart models (Freezed), JSON schemas, Hive adapters, repository interfaces | 🔴 READ THIRD |
| 03 | `03_NAVIGATION_AND_SHELL.md` | GoRouter config, bottom nav bar, route guards, deep linking | 🔴 CRITICAL |
| 04 | `04_SCREEN_HOME_PAGE.md` | Home Page — Player / Reader / Navigator (PRIMARY SCREEN, 95% of user time) | 🔴 CRITICAL |
| 05 | `05_SCREEN_RECORDING_PAGE.md` | Recording Page — full-screen per-verse recording activity | 🔴 CRITICAL |
| 06 | `06_SCREEN_SURAHS_LIST.md` | Surahs List — browse, search, filter all 114 surahs | 🟡 HIGH |
| 07 | `07_SCREEN_SURAH_DETAIL.md` | Surah Detail — chunk list, auto-generation, per-chunk actions | 🟡 HIGH |
| 08 | `08_SCREEN_SETTINGS.md` | Settings — all configuration sections | 🟡 HIGH |
| 09 | `09_SCREEN_PROGRESS.md` | Progress & Stats — analytics, predictions, goals, milestones | 🟡 HIGH |
| 10 | `10_SCREEN_LIBRARY.md` | Library — recordings management, bookmarks, collections | 🟡 HIGH |
| 11 | `11_SCREEN_ONBOARDING.md` | Onboarding — 5-screen first-launch wizard + splash screen | 🟢 MEDIUM |
| 12 | `12_MINI_PLAYER.md` | Mini Player — persistent overlay on non-Home pages during playback | 🟢 MEDIUM |
| 13 | `13_GLOBAL_STATES_DIALOGS.md` | Empty states, error handling, loading skeletons, shared dialogs | 🟢 MEDIUM |
| 14 | `14_AUDIO_ENGINE.md` | Playback service, background audio handler, ambient mixer, DSP pipeline | 🔴 CRITICAL |
| 15 | `15_CROSS_CUTTING.md` | Dark mode, accessibility, haptics, notifications, RTL, animations master table | 🟡 HIGH |
| 16 | `16_IMPLEMENTATION_PLAN.md` | Phased build order, dependency graph, milestone checklist | 🟡 HIGH |

---

## 🎯 QUICK START FOR CODING AGENT

```
1. Read 00_PROJECT_OVERVIEW.md — understand what we're building and why
2. Read 01_ARCHITECTURE.md — understand tech stack and structure
3. Read 02_DATA_MODELS.md — implement models first (Freezed + Hive)
4. Read 03_NAVIGATION_AND_SHELL.md — scaffold the app shell
5. Read 04_SCREEN_HOME_PAGE.md — build the primary screen
6. Read 05_SCREEN_RECORDING_PAGE.md — build the recording activity
7. Read 14_AUDIO_ENGINE.md — wire up playback + background audio
8. Build remaining screens in any order (06-13)
9. Apply cross-cutting concerns from 15_CROSS_CUTTING.md
10. Follow 16_IMPLEMENTATION_PLAN.md for phased delivery
```

---

## ⚠️ NON-NEGOTIABLE RULES

1. **Per-verse audio files** — each verse = separate `.m4a`, NEVER one continuous recording
2. **Playback on Home Page** — NO separate player screen, everything inline
3. **Forward-only recording** — NO Previous button on Recording Page
4. **Background audio** — screen-off playback is THE core feature
5. **RTL for Arabic content** — `Directionality.rtl` wrapper, inverted arrows
6. **Nested repetition** — verse reps × chunk reps, infinite loop supported
7. **Default entry = last active chunk** — NOT a dashboard or surah list
