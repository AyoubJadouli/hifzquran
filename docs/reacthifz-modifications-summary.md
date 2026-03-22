# ReactHifz Modifications & Feature Summary

This document summarizes all notable feature requests, fixes, and UX changes discussed and implemented during the current chat, so the same work can be ported to another version of the app such as a Flutter implementation.

## 1. Quran Assets & Offline Data

### Objective
Bundle complete Quran content locally and stop depending on runtime API fetching for core reading data.

### Implemented
- Added local Quran JSON assets under `public/quran/`
- Supported bundled assets include:
  - Arabic Uthmani / Hafs (`quran-uthmani.json`)
  - Warsh (`quran-warsh.json`)
  - Qalun (`quran-qalun.json`)
  - Al-Duri (`quran-douri.json`)
  - translations: EN / FR / ES / UR / TR / ID
  - transliteration: English

### Data-loading behavior
- App Quran data now loads from local JSON files instead of requesting surahs live from the remote service.
- Surah list and surah content are cached in memory and partially cached in browser local storage.

### Flutter port guidance
- Ship the same datasets as bundled assets.
- Build a repository layer that resolves text by:
  - riwaya
  - translation language
  - transliteration source/language

---

## 2. Surah Navigation Fixes

### Objective
Fix a regression where opening any surah showed Al-Fatiha only.

### Root causes addressed
- Surah detail page was using the wrong fetch path/default logic.
- Query param handling and route navigation caused fallback to `id=1`.
- Surah list navigation was not preserving the correct app route/query flow.

### Implemented
- Surah detail now loads data using full language/riwaya-aware fetch logic.
- Navigation from Surahs list now targets the app route explicitly.
- Query parameters are read via router-aware APIs.

### Flutter port guidance
- Ensure surah detail screen receives a strongly typed surah id.
- Avoid implicit fallback to first surah when route state is absent.

---

## 3. Full-Quran Chunk Generation

### Objective
Generate chunk indexes for the entire Quran using current settings.

### Implemented
- Added Settings action to generate chunks for all 114 surahs using:
  - current chunk size
  - current overlap
- Initially this saved full chunk records and hit browser quota.

### Flutter port guidance
- Keep this as a one-tap preprocessing utility.
- Prefer compact index generation rather than storing full repeated objects.

---

## 4. Chunk Storage Quota Optimization

### Problem
Saving full chunk rows or even a large compact index in localStorage exceeded storage quota.

### Implemented solution
- Introduced a compact chunk index model.
- Instead of storing full chunk records for every chunk, store only minimal tuples:
  - `[chunk_index, start_verse, end_verse]`
- Added a separate large-data storage backend in IndexedDB for this chunk index.
- Runtime screens reconstruct chunk objects on demand from:
  1. real saved chunk progress records if they exist
  2. otherwise the compact chunk index
  3. otherwise regenerate from current rules

### Important behavior
- Compact chunk index is stored in IndexedDB, not localStorage.
- User settings remain in localStorage.

### Flutter port guidance
- Use a lightweight local database (Hive/Isar/SQLite/shared prefs combo depending scale).
- Store chunk structure separately from chunk progress.
- Reconstruct view models at runtime.

---

## 5. Record Screen Navigation Fix

### Problem
After runtime/generated chunk ids were introduced, tapping Record no longer opened the correct chunk recording page.

### Implemented solution
- Record page now resolves three cases:
  1. saved chunk row exists in local entity store
  2. chunk exists only in compact indexed form
  3. fallback runtime regeneration by surah metadata and settings

### Flutter port guidance
- Recording screen should resolve chunk identity independently of whether chunk progress is pre-persisted.

---

## 6. Surah Order Following Hifz Settings

### Objective
Make Surahs list follow configured memorization order.

### Implemented
- Surahs list supports:
  - forward mushaf order
  - reverse mushaf order
  - revelation order forward
  - revelation order reverse

### Flutter port guidance
- Use one reusable ordering helper for surah list and any reader selector if desired.

---

## 7. Root, Landing, and SEO Routing Behavior

### Objective
Show landing page only on first real user visit to root, but keep landing available for crawlers and SEO.

### Implemented behavior
- On first human visit to `/`:
  - redirect to localized landing page
- On later human visits to `/`:
  - redirect directly to `/app/Home`
- For crawlers/bots:
  - always redirect to the localized landing page for crawlability

### Route improvements
- Added explicit landing route such as `/:lang/landing`
- Kept `/:lang/about` accessible and SEO-indexable
- Adjusted canonical/alternate link strategy for landing URLs

### Flutter port guidance
- If Flutter web is used, preserve clear public marketing URLs and distinguish marketing routing from in-app routing.

---

## 8. Marketing Credits & Branding Changes

### Requested changes
- Remove Makne branding from CTA button/link usage.
- Use AI7SKY as the visible button text.
- Put full credit wording in About content instead.
- Credit Allah سبحانه وتعالى and the ai7sky.com team.

### Implemented
- Marketing external buttons now point to `https://ai7sky.com/`
- Button/link label shows only `AI7SKY`
- About content includes full credit wording

### Flutter port guidance
- Separate visible CTA label from long attribution copy.
- Keep attribution in About / footer / credits sections.

---

## 9. Home Page Full Chunk Mode

### Objective
Add a mode in Home that displays the whole current chunk in one fullscreen-style reading block instead of verse-by-verse memorization cards.

### Implemented
- Toggle button added in Home top-right area
- Two Home display modes:
  1. Ayat mode
  2. Full chunk mode
- Full chunk mode behavior:
  - adaptive text sizing based on content length and screen size
  - Arabic displayed for Arabic mode
  - transliteration displayed for non-Arabic mode
  - ayah number separators inserted between verses

### Flutter port guidance
- Use responsive typography and one clean mode switch.
- Keep it as a visual mode only, not a separate memorization state.

---

## 10. Dedicated Normal Quran Reader Screen

### Objective
Create a separate Quran reading page that is not based on chunking or memorization tools.

### Implemented
- Added dedicated app route/page for Reader
- Added bottom-nav entry for Reader
- Reader uses the same app theme language and riwaya settings
- Reader features:
  - surah selector
  - flowing Quran text (not one ayah card per row)
  - inline ayah numbers
  - inline sajda markers
  - optional translation section below the Arabic text for non-Arabic reading modes

### Flutter port guidance
- Treat this page as a distinct “reading mode” screen, not a derivative of chunk memorization UI.

---

## 11. Reader Layout Refinements

### Requested refinements
- Reader should look like normal Quran apps, not one ayah per line/card.
- Reading text and titles should be visually centered.
- Header should respect RTL.

### Implemented
- Converted reader content into one flowing reading panel.
- Centered the Arabic reading column using a constrained max-width container.
- Header block (`المصحف / Quran Reader / title`) adjusted to respect RTL and centered layout.
- In-card surah title block also centered.

### Flutter port guidance
- Use a centered reading column with max width.
- Separate header alignment from text flow alignment.

---

## 12. Reader Bookmark / Marker System

### Objective
Add a simple bookmark/marker system for the Reader page.

### Implemented data model
- Added `Bookmark` entity to local app storage.
- One active bookmark record stores:
  - `surah_number`
  - `ayah_number`
  - `label`

### Reader behavior
- Clicking ayah number acts as the marker action.
- Marked ayah shows highlighted state.
- Visible marker badge shows the current marked location.
- Added one rounded marker-jump button to the right of the surah select bar.
- Marker jump behavior:
  - if bookmark is in current surah → scroll to marked ayah
  - if bookmark is in another surah → switch to that surah first

### Animation / feedback
- Ayah number marker interaction uses a clear visual animation:
  - scale pulse
  - glow effect

### Flutter port guidance
- Use a very small bookmark model.
- One-tap mark / one-tap jump is enough.
- Add obvious animation to confirm a successful mark.

---

## 13. Storage Management in Settings

### Objective
Add maintenance tools to inspect and clean app storage while preserving settings.

### Implemented
- New Settings storage section
- Shows estimated storage usage vs quota
- Displays progress bar for usage
- Clear-storage action preserves saved settings while clearing:
  - generated chunk index
  - cached progress
  - local app data
  - recording metadata

### Flutter port guidance
- Add “storage diagnostics” and “clear cache while preserving settings” as first-class tools.

---

## 14. Sajda Metadata Support

### Objective
Expose sajda information in verse payloads so reading UIs can render sajda indicators.

### Implemented
- Verse objects include `sajda` metadata from bundled Quran assets.

### Flutter port guidance
- Keep sajda as raw structured metadata and format it in the UI layer.

---

## 15. Summary of New/Updated Screens

### A. Home
- Verse-by-verse memorization mode
- Full chunk reading mode toggle

### B. Surahs
- Ordered based on Hifz setting

### C. Surah Detail
- Loads correct surah and chunk metadata

### D. Record
- Handles persisted and runtime/generated chunk ids

### E. Reader
- Dedicated normal Quran reader
- Bookmarkable ayah numbers
- Marker jump button
- Sajda markers
- Flowing Arabic reading layout

### F. Settings
- Full-Quran chunk generation
- Storage usage display
- Clear storage while preserving settings

---

## 16. Porting Priorities for Flutter

If porting to Flutter, recommended implementation order:

1. **Bundled Quran local assets**
2. **Quran repository for riwaya/translation/transliteration**
3. **Dedicated Reader screen**
4. **Bookmark model + jump-to-marker**
5. **Surah ordering logic**
6. **Compact chunk index generation**
7. **Chunk reconstruction at runtime**
8. **Record screen chunk resolution**
9. **Settings storage tools**
10. **Marketing/root routing behavior for Flutter web**

---

## 17. Design Intent Recap

The user direction through this chat consistently pushed the app toward these principles:

- local-first Quran data
- lightweight browser storage
- explicit separation between **memorization** and **reading** experiences
- simple but visible marker/bookmark flows
- RTL-friendly Quran presentation
- visually premium Islamic theme
- SEO-friendly public marketing routes

These principles should remain unchanged when rebuilding the same feature set in Flutter.
