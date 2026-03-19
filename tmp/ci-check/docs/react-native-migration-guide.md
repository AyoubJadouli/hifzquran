# React Hifz → React Native Migration Guide (Android, iOS, macOS)

This guide explains how to migrate this app from React (Vite/Web) to React Native in a practical, production-focused way.

---

## 1) Recommended strategy

Use a **shared-core + platform-shell** architecture:

- Keep business logic/data layer shared (Quran APIs, chunk generation, settings rules, progress calculations).
- Build a React Native UI shell for mobile/desktop-native UX.
- Keep web as a separate shell if needed.

Best stack for your target platforms:

- **Expo + Expo Router + React Native** for Android + iOS.
- **React Native macOS** for macOS support (or keep macOS as web/PWA until phase 2).

---

## 2) What can be reused directly from current app

Good candidates to move into shared code:

- `src/components/quranData.jsx` (convert to TS and remove web-only assumptions).
- Chunk logic (`generateChunks`) and progress computations.
- Settings schema/defaults.
- Any pure utility functions.

What must be rewritten:

- All UI components using HTML/CSS/Tailwind classes.
- Browser-only APIs: `localStorage`, `<audio>`, `MediaRecorder`, DOM navigation patterns.

---

## 3) Proposed target repository structure

```txt
reacthifz/
  apps/
    web/                # existing Vite app
    mobile/             # Expo app (Android/iOS)
    macos/              # RN macOS app (optional phase 2)
  packages/
    core/               # shared business logic/types/services
    ui-native/          # shared RN components
```

If you prefer simple setup first, start with only `apps/mobile` and move shared code gradually.

---

## 4) Library mapping (Web → Native)

- `react-router-dom` → `expo-router` (or `@react-navigation/native`)
- Tailwind CSS classes → `nativewind` **or** `StyleSheet`
- `localStorage` → `@react-native-async-storage/async-storage`
- Browser audio (`new Audio`) → `expo-av` (or `react-native-track-player`)
- `MediaRecorder` → `expo-av` recording APIs
- Shadcn/Radix web UI → RN component kit (Tamagui, NativeBase, Paper, or custom)
- Recharts → `react-native-svg-charts` / `victory-native`

---

## 5) Migration phases

## Phase A — Foundation (1–2 days)

1. Create Expo app.
2. Add navigation + theme context.
3. Add TypeScript and shared `packages/core` (or `src/core`).

## Phase B — Data layer (1–2 days)

1. Port `quranData` service to RN-safe code.
2. Replace local storage calls with AsyncStorage wrapper.
3. Implement offline cache strategy and versioning.

## Phase C — Core screens (3–5 days)

Migrate in order:

1. Home
2. Surahs
3. SurahDetail
4. AppSettings
5. Progress
6. Record

## Phase D — Audio + Recording (2–4 days)

1. Playback controls with `expo-av`.
2. Recording flow with permissions.
3. Save recordings and metadata in local DB/storage.

## Phase E — Hardening (2–4 days)

1. Performance profiling.
2. Offline full-pack download UI + progress.
3. Crash reporting + analytics.
4. Release builds and store preparation.

---

## 6) Data and storage recommendations for production

For full Quran + multi-language translation/transliteration, prefer:

- **Metadata/database**: SQLite (`expo-sqlite`)
- **Large JSON/audio files**: `expo-file-system`
- **Small preferences**: AsyncStorage

Suggested offline pack model:

- Pack manifest (version, hash, languages, recitation edition).
- Download queue by surah/language.
- Resume support + integrity checks.
- “Rebuild cache” option in settings.

---

## 7) Screen-by-screen notes

### Home
- Keep logic; rewrite layout using `View`, `Text`, `ScrollView`, `Pressable`.
- Use `FlatList` for verse rendering/performance.

### Surahs / SurahDetail
- Straightforward port with RN lists.
- Replace icon buttons with RN touchable components.

### Record
- Biggest platform change.
- Replace MediaRecorder with `Audio.Recording` from `expo-av`.
- Handle permissions with Expo Permissions flow.

### Progress
- Replace web chart libs with native chart package.

---

## 8) macOS path

Two options:

1. **Fast path**: keep web app for desktop/macOS via browser/PWA.
2. **Native path**: React Native macOS app (recommended only after mobile is stable).

If native macOS is required, share as much as possible from mobile core and UI primitives.

---

## 9) CI/CD and release

- Android/iOS: use EAS Build + EAS Submit.
- Add environment management for API endpoints and feature flags.
- Add Sentry for crash monitoring.
- Add smoke E2E with Detox (later stage).

---

## 10) Risks and mitigations

- **Large offline bundle size** → incremental downloads + language packs.
- **Audio differences per platform** → central audio service abstraction.
- **UI rewrite cost** → migrate feature-by-feature, keep shared logic stable.
- **Performance on low-end devices** → list virtualization + memoization.

---

## 11) Practical first implementation plan for this project

1. Bootstrap Expo TypeScript app.
2. Move `quranData` + chunk logic into shared core.
3. Implement storage adapter interface:
   - `getItem/setItem/removeItem`
   - Web impl: localStorage
   - Native impl: AsyncStorage
4. Port Home + Surahs + SurahDetail first.
5. Port Record with `expo-av`.
6. Add offline full-pack downloader with progress UI.
7. Validate Android, then iOS, then macOS strategy.

---

## 12) Definition of done (production-ready)

- Android + iOS builds pass and run smoothly.
- Quran data pack downloads and restores correctly.
- Recording + playback stable across app lifecycle events.
- Language switching works for EN/FR/ES/UR/TR/ID.
- Warsh-first content path functioning with fallback.
- Crash-free sessions and acceptable performance metrics.
