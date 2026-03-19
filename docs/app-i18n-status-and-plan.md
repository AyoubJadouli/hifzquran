# App i18n Status and Remaining Plan

## Goal

Make the full application UI internationalized, not only the marketing pages.

This document records:

1. what has already been implemented,
2. what is still only partially migrated,
3. the exact remaining files that still need i18n work,
4. the recommended order for finishing the migration.

---

## Current Status

The project now has two i18n layers:

- **Marketing i18n** in `src/pages/marketing/i18n.js`
- **App i18n** in `src/components/appI18n.js`

### Already implemented

#### 1. App-level i18n foundation

Created:

- `src/components/appI18n.js`

This file currently provides:

- supported app languages
- language normalization
- a translation accessor via `getAppT(language)`
- translated common labels for the main supported languages:
  - English
  - Arabic
  - French
  - Spanish
  - German
  - Turkish
  - Urdu
  - Indonesian
  - Portuguese
  - Chinese

#### 2. App shell partially migrated

Updated:

- `src/components/AppLayout.jsx`

The bottom navigation now uses app i18n keys instead of hardcoded labels.

#### 3. Core pages partially migrated

Updated:

- `src/pages/Surahs.jsx`
- `src/pages/SurahDetail.jsx`
- `src/pages/Progress.jsx`

These now use app i18n for some visible labels, but they are **not yet fully complete**.

#### 4. Marketing pages partially migrated

Updated:

- `src/pages/marketing/i18n.js`
- `src/pages/marketing/MarketingLayout.jsx`
- `src/pages/marketing/LandingPage.jsx`
- `src/pages/marketing/FeaturesPage.jsx`
- `src/pages/marketing/AboutPage.jsx`

The marketing dictionary now includes translated keys for:

- navigation labels
- CTA labels
- feature cards
- footer
- about content

The marketing layout and some pages already consume those keys.

---

## Files currently modified in working tree

The current local changes already include the following files:

- `src/components/AppLayout.jsx`
- `src/components/quranData.jsx`
- `src/components/useSettings.jsx`
- `src/pages/AppSettings.jsx`
- `src/pages/Home.jsx`
- `src/pages/Progress.jsx`
- `src/pages/SurahDetail.jsx`
- `src/pages/Surahs.jsx`
- `src/pages/marketing/AboutPage.jsx`
- `src/pages/marketing/FeaturesPage.jsx`
- `src/pages/marketing/LandingPage.jsx`
- `src/pages/marketing/MarketingLayout.jsx`
- `src/pages/marketing/i18n.js`
- `src/components/appI18n.js` (new)

---

## Still Not Fully Internationalized

The following areas still contain hardcoded English or partially hardcoded English.

### High priority remaining files

#### Marketing

- `src/pages/marketing/LandingPage.jsx`
  - English-only long explanatory/FAQ blocks still exist.

#### Core app pages

- `src/pages/Home.jsx`
- `src/pages/AppSettings.jsx`
- `src/pages/Recite.jsx`
- `src/pages/Record.jsx`

#### Shared core app components

- `src/components/home/OptionsSheet.jsx`
- `src/components/home/LuxuryControlBar.jsx`
- `src/components/home/PlaybackStatusBar.jsx`
- `src/components/home/SurahSelector.jsx`
- `src/components/home/ChunkHeader.jsx`

### Medium priority remaining files

Potentially review as well:

- `src/components/home/ControlBar.jsx`
- `src/components/home/PlaybackControls.jsx`
- `src/components/home/VerseCard.jsx`
- `src/components/home/LuxuryVerseStack.jsx`
- `src/pages/Record.jsx`
- `src/pages/Recite.jsx`

### Notes about data vs UI

Some text shown in the app comes from Quran API payloads and is not the same as UI i18n.

Examples:

- surah English names
- surah English translations
- revelation type values such as `Meccan` / `Medinan`

If needed, those values should be normalized through a display-mapping layer instead of being treated as app UI labels.

---

## Recommended Remaining Plan

### Phase 1 — finish visible core app chrome

Migrate these first because they are always visible and create the strongest impression that Arabic is incomplete:

1. `src/pages/AppSettings.jsx`
2. `src/components/home/OptionsSheet.jsx`
3. `src/components/home/LuxuryControlBar.jsx`
4. `src/components/home/PlaybackStatusBar.jsx`
5. `src/components/home/SurahSelector.jsx`
6. `src/components/home/ChunkHeader.jsx`

What to do:

- import `getAppT`
- resolve `settings.display_language`
- replace hardcoded labels with `i18n.*` keys
- extend `src/components/appI18n.js` only when a missing key is needed

### Phase 2 — finish Home screen

File:

- `src/pages/Home.jsx`

What to replace:

- recite prompt text
- loading text
- default action labels
- any helper/status strings still embedded in JSX or derived variables

### Phase 3 — finish workflow pages

Files:

- `src/pages/Record.jsx`
- `src/pages/Recite.jsx`

This phase is large because these files contain many UX labels, button texts, dialog texts, confirmations, timers, and status messages.

### Phase 4 — finish marketing residual content

File:

- `src/pages/marketing/LandingPage.jsx`

Remaining issue:

- English-only explanatory content and FAQ blocks under `isEn`

Decision to make:

- either fully translate them for all supported languages,
- or intentionally keep that section English-only and hide it for non-English locales.

For a consistent Arabic experience, full translation is preferable.

### Phase 5 — normalize API-provided English metadata

If the goal is a polished Arabic UI, consider mapping the following API values:

- `Meccan` / `Medinan`
- English surah subtitle phrasing when shown in Arabic mode

This is not app-i18n-only; it is a display-formatting layer.

---

## Suggested Implementation Pattern

For each file:

```jsx
import { getAppT } from "../components/appI18n";
import { useSettings } from "../components/useSettings";

const { settings } = useSettings();
const i18n = getAppT(settings.display_language);
```

Then replace strings like:

```jsx
"Settings"
```

with:

```jsx
i18n.settingsTitle
```

And dynamic strings like:

```jsx
`Verses ${start}–${end}`
```

with:

```jsx
i18n.commonVerseRange({ start, end })
```

---

## Immediate Next Files to Edit

If continuing right away, the next best order is:

1. `src/pages/AppSettings.jsx`
2. `src/components/home/OptionsSheet.jsx`
3. `src/components/home/LuxuryControlBar.jsx`
4. `src/components/home/PlaybackStatusBar.jsx`
5. `src/components/home/SurahSelector.jsx`
6. `src/components/home/ChunkHeader.jsx`
7. `src/pages/Home.jsx`
8. `src/pages/Recite.jsx`
9. `src/pages/Record.jsx`
10. `src/pages/marketing/LandingPage.jsx` FAQ block

---

## Definition of Done

The i18n task should only be considered complete when:

- no major user-facing English labels remain in Arabic mode,
- all app navigation/actions/dialogs/settings are translated,
- marketing pages do not show unintended English in non-English locales,
- build passes successfully,
- any intentional English-only content is explicitly documented.
