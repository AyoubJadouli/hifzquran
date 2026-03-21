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

- supported app languages via `APP_LANGS`
- language normalization via `normalizeAppLang(input)`
- a translation accessor via `getAppT(language)`
- fallback behavior through `createTranslator(...)` so missing keys fall back to English/base keys
- translated app labels for these supported languages:
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

The current dictionary is no longer just navigation-only. It already includes shared/common labels plus a substantial set of `Progress`, `Surahs`, and `SurahDetail` strings.

#### 2. App shell migrated

Updated:

- `src/components/AppLayout.jsx`

The bottom navigation is already wired to app i18n keys:

- `i18n.navHome`
- `i18n.navSurahs`
- `i18n.navProgress`
- `i18n.navSettings`

#### 3. Core pages with meaningful app-i18n usage

Updated:

- `src/pages/Surahs.jsx`
- `src/pages/SurahDetail.jsx`
- `src/pages/Progress.jsx`

These pages are further along than the previous version of this document suggested:

- `Surahs.jsx` uses app i18n for the main page title, search placeholder, header stats, and verse-count formatting.
- `SurahDetail.jsx` uses app i18n for back text, chunk labels, verse ranges, chunk-completion summaries, and recite button tooltip text.
- `Progress.jsx` is heavily migrated and uses app i18n across the page header, stats cards, charts section titles, activity summary labels, and tip text.

#### 4. Marketing pages partially migrated

Updated:

- `src/pages/marketing/i18n.js`
- `src/pages/marketing/MarketingLayout.jsx`
- `src/pages/marketing/LandingPage.jsx`
- `src/pages/marketing/FeaturesPage.jsx`
- `src/pages/marketing/AboutPage.jsx`

The marketing dictionary is already being consumed for:

- navigation labels
- CTA labels
- feature cards
- footer
- about content
- the main hero/title/description content on the landing page

However, `LandingPage.jsx` still contains an English-only residual section gated behind `isEn`.

---

## Current App-i18n Coverage Snapshot

### Mostly covered already

These areas are already using app i18n in a meaningful way, though some may still benefit from polish later:

- `src/components/AppLayout.jsx`
- `src/pages/Progress.jsx`
- `src/pages/Surahs.jsx`
- `src/pages/SurahDetail.jsx`

### Foundation present but dictionary still limited

`src/components/appI18n.js` is working and already in active use, but it still does **not** yet contain the large set of keys needed to finish:

- settings UI
- playback/options UI
- record flow UI
- recite flow UI
- helper/confirmation dialogs
- marketing FAQ/explanatory long-form content

---

## Files currently modified in working tree

The document should no longer claim a specific working-tree list unless it is freshly verified with git status.

What is clearly true from the current codebase is that the i18n migration has already touched at least these files:

- `src/components/AppLayout.jsx`
- `src/components/appI18n.js`
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

If this section needs to reflect the **exact** working tree later, it should be regenerated from `git status --short` instead of kept as a static list.

---

## Still Not Fully Internationalized

The following areas still contain hardcoded English or only partial i18n coverage.

### High priority remaining files

#### Core app pages

- `src/pages/AppSettings.jsx`
  - header still contains hardcoded Arabic + English labels
  - section titles are hardcoded
  - row labels are hardcoded
  - theme labels are hardcoded
  - Hifz order labels are hardcoded
  - tip content is hardcoded
  - many option values still include English like `verses`, `Light`, `Dark`, etc.

- `src/pages/Home.jsx`
  - recite prompt banner is hardcoded English
  - loading message is hardcoded English
  - `reciteLabel` still uses hardcoded `Re-test` / `Recite`
  - page depends on several child components that are still not localized

- `src/pages/Recite.jsx`
  - nearly the entire recitation workflow remains English-only
  - includes recording alerts, phase titles, helper text, validation messages, discard dialogs, celebration copy, and next-step actions

- `src/pages/Record.jsx`
  - nearly the entire recording workflow remains English-only
  - includes microphone permission state, verse labels, helper text, primary/secondary action buttons, save dialog, discard dialog, and save/discard labels

#### Shared core app components

- `src/components/home/OptionsSheet.jsx`
  - sheet title, section titles, empty state, gap labels, toggle labels, and descriptions are all hardcoded

- `src/components/home/LuxuryControlBar.jsx`
  - button labels are hardcoded (`Record`, `Pause`, `Resume`, `Stop`, `Play`, `Menu`)
  - fallback recording info text is hardcoded (`Tap Record to add a recitation`)

- `src/components/home/PlaybackStatusBar.jsx`
  - status text is hardcoded (`Playing`, `Paused`, `Rep`, `Loop`, `prev verse`, `next verse`)

- `src/components/home/SurahSelector.jsx`
  - default trigger text and search placeholder are hardcoded
  - surah summary line still hardcodes `verses`
  - loading state has no localized label

- `src/components/home/ChunkHeader.jsx`
  - verse range text is still hardcoded as `Verses {start}–{end}`
  - compact chunk-position text for large chunk counts uses plain numeric text with no i18n helper

#### Marketing

- `src/pages/marketing/LandingPage.jsx`
  - still contains English-only explanatory and FAQ sections behind `isEn`
  - these are intentionally hidden outside English for now, but they are still unfinished from a full-i18n perspective

### Medium priority review files

These were not the biggest blockers, but they should still be reviewed before calling the migration complete:

- `src/components/home/VerseCard.jsx`
  - current-verse footer still says `{verseIndex + 1} of {totalVerses}` in English

- `src/components/home/ControlBar.jsx`
- `src/components/home/PlaybackControls.jsx`
- `src/components/home/LuxuryVerseStack.jsx`

These may already be partly visual/non-textual, but they should still be audited for user-facing English.

---

## Important Corrections vs. Previous Version of This Doc

The previous version of this document understated some completed work.

### `Progress.jsx`

This page is **not** just “partially migrated for some visible labels.” It already uses app i18n for a large share of the user-visible UI and is among the more advanced app pages in the migration.

### `Surahs.jsx`

This page is also beyond the “some labels only” stage. It already uses app i18n for the main top-level searchable list experience, though API-provided metadata still appears in English.

### `SurahDetail.jsx`

This page has meaningful i18n coverage already, but still depends on API metadata like revelation type and English name/translation strings that are not yet normalized for locale-specific display.

### Working-tree section

The prior “Files currently modified in working tree” section should not be treated as authoritative anymore unless revalidated from git.

---

## Notes about data vs UI

Some text shown in the app comes from Quran API payloads and is not the same as UI i18n.

Examples:

- surah English names
- surah English translations
- revelation type values such as `Meccan` / `Medinan`

These values currently still appear in several places, including:

- `src/pages/Surahs.jsx`
- `src/pages/SurahDetail.jsx`
- `src/components/home/SurahSelector.jsx`
- `src/pages/Record.jsx`
- `src/pages/Recite.jsx`

If the product goal is a polished Arabic or multilingual experience, these should be normalized through a display-mapping layer instead of being treated as app UI labels.

---

## Recommended Remaining Plan

### Phase 1 — finish visible core app chrome

Migrate these first because they are always visible and currently expose obvious English in the main app experience:

1. `src/pages/AppSettings.jsx`
2. `src/components/home/OptionsSheet.jsx`
3. `src/components/home/LuxuryControlBar.jsx`
4. `src/components/home/PlaybackStatusBar.jsx`
5. `src/components/home/SurahSelector.jsx`
6. `src/components/home/ChunkHeader.jsx`
7. `src/components/home/VerseCard.jsx`

What to do:

- import `getAppT`
- resolve `settings.display_language` via `useSettings()`
- replace hardcoded labels with `i18n.*` keys
- extend `src/components/appI18n.js` only when a missing key is needed
- prefer reusable helpers for dynamic strings such as verse range, playback state, repetition summary, and chunk position

### Phase 2 — finish Home screen

File:

- `src/pages/Home.jsx`

What to replace:

- recite prompt copy
- loading text
- default action labels derived in local variables
- any helper/status strings still embedded in JSX

Important note:

This phase becomes much cleaner after the shared home components are migrated first.

### Phase 3 — finish workflow pages

Files:

- `src/pages/Record.jsx`
- `src/pages/Recite.jsx`

This is still the largest remaining phase because these files contain:

- recording and permission states
- alerts and confirmations
- helper/instructional copy
- button labels
- validation flows
- celebration states
- duration/confidence summaries

### Phase 4 — finish marketing residual content

File:

- `src/pages/marketing/LandingPage.jsx`

Remaining issue:

- English-only explanatory content and FAQ blocks remain inside the `isEn` branch

Decision to make:

- either fully translate them for all supported marketing languages,
- or intentionally keep them English-only and explicitly document that choice.

Right now the implementation behaves more like:

- translated hero/marketing chrome for all locales
- extra SEO/supporting content only for English

That is acceptable as a product decision, but it should be documented as intentional if kept.

### Phase 5 — normalize API-provided English metadata

If the goal is a polished Arabic UI, add a display-formatting layer for:

- `Meccan` / `Medinan`
- surah subtitle phrasing shown in app chrome
- English surah naming/subtitle patterns when shown in non-English modes

This is adjacent to app i18n, but not solved by `appI18n.js` alone.

---

## Suggested Implementation Pattern

For each app file:

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

For workflow pages, prefer grouped namespaces in the dictionary, for example:

- `settings.*`
- `home.*`
- `record.*`
- `recite.*`
- `playback.*`

That will scale better than putting every new key under `common.*`.

---

## Immediate Next Files to Edit

If continuing right away, the best next order based on the current code is:

1. `src/pages/AppSettings.jsx`
2. `src/components/home/OptionsSheet.jsx`
3. `src/components/home/LuxuryControlBar.jsx`
4. `src/components/home/PlaybackStatusBar.jsx`
5. `src/components/home/SurahSelector.jsx`
6. `src/components/home/ChunkHeader.jsx`
7. `src/components/home/VerseCard.jsx`
8. `src/pages/Home.jsx`
9. `src/pages/Recite.jsx`
10. `src/pages/Record.jsx`
11. `src/pages/marketing/LandingPage.jsx` residual FAQ/explanatory block

---

## Definition of Done

The i18n task should only be considered complete when:

- no major user-facing English labels remain in Arabic mode,
- all app navigation/actions/dialogs/settings are translated,
- record and recite workflows are translated end-to-end,
- marketing pages do not show unintended English in non-English locales,
- any intentional English-only content is explicitly documented,
- build passes successfully.
