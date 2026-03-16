# 03 — NAVIGATION & SHELL

## Route Table

| Route | Page | Bottom Nav | Notes |
|-------|------|-----------|-------|
| `/home` | Home Page | ✅ tab 0 | Query param: `?chunk={chunkId}&autoplay=true` |
| `/surahs` | Surahs List | ✅ tab 1 | |
| `/surah/:id` | Surah Detail | ✅ (nested under surahs) | |
| `/library` | Library | ✅ tab 2 | Tabs: Recordings, Bookmarks, Collections |
| `/progress` | Progress & Stats | ✅ tab 3 | Tabs: Overview, Surahs, History, Goals |
| `/settings` | Settings | ✅ tab 4 | Part of "More" or direct tab |
| `/record/:chunkId` | Recording Page | ❌ full-screen | Pushes on top, covers bottom nav |

---

## GoRouter Configuration

```dart
final router = GoRouter(
  initialLocation: '/home',
  redirect: (context, state) {
    final settings = settingsRepo.get();
    if (!settings.onboardingComplete && state.matchedLocation != '/onboarding') {
      return '/onboarding';
    }
    return null;
  },
  routes: [
    // Onboarding (outside shell)
    GoRoute(
      path: '/onboarding',
      builder: (_, __) => const OnboardingFlow(),
    ),

    // Recording (outside shell — full-screen, no bottom nav)
    GoRoute(
      path: '/record/:chunkId',
      builder: (_, state) => RecordPage(
        chunkId: state.pathParameters['chunkId']!,
      ),
    ),

    // Main Shell (with bottom nav + mini player)
    ShellRoute(
      builder: (_, __, child) => MainShell(child: child),
      routes: [
        GoRoute(
          path: '/home',
          builder: (_, state) => HomePage(
            chunkId: state.uri.queryParameters['chunk'],
            autoplay: state.uri.queryParameters['autoplay'] == 'true',
          ),
        ),
        GoRoute(
          path: '/surahs',
          builder: (_, __) => const SurahsListPage(),
          routes: [
            GoRoute(
              path: ':id',
              builder: (_, state) => SurahDetailPage(
                surahNumber: int.parse(state.pathParameters['id']!),
              ),
            ),
          ],
        ),
        GoRoute(path: '/library', builder: (_, __) => const LibraryPage()),
        GoRoute(path: '/progress', builder: (_, __) => const ProgressPage()),
        GoRoute(path: '/settings', builder: (_, __) => const SettingsPage()),
      ],
    ),
  ],
);
```

---

## MainShell Widget

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                     child (page content)                     │
│                                                              │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  MINI PLAYER (conditional — visible if playing AND not Home) │
├──────────────────────────────────────────────────────────────┤
│  🏠 Home   📖 Surahs   📑 Library   📊 Stats   ⚙️ More    │
│   ━━                                                         │
└──────────────────────────────────────────────────────────────┘
```

**Functional requirements:**

- Bottom navigation: 5 tabs mapped to routes above
- `NavigationBar` (Material 3) with `NavigationDestination` items
- Active tab determined by current route
- Mini Player overlay sits between child and bottom nav (see `12_MINI_PLAYER.md`)
- Mini Player visible only when: `playbackState.isPlaying || playbackState.isPaused` AND current route ≠ `/home`

---

## Default Entry Logic

```
APP LAUNCH
  │
  ├─→ Initialize Hive
  ├─→ Load settings from Hive
  │
  ├─→ IF onboardingComplete == false:
  │     └─→ redirect to /onboarding
  │
  ├─→ IF lastActiveChunkId exists in Hive meta box:
  │     └─→ navigate to /home?chunk={lastActiveChunkId}
  │
  └─→ ELSE (first time after onboarding):
        └─→ navigate to /home (Home will show empty state → "Pick a surah")
```

---

## Deep Link Handling

| Link Pattern | Action |
|-------------|--------|
| `hifzcompanion://home?chunk={id}` | Open Home with specific chunk |
| `hifzcompanion://home?chunk={id}&autoplay=true` | Open Home + auto-start playback |
| `hifzcompanion://record/{chunkId}` | Open Recording Page |
| `hifzcompanion://surah/{number}` | Open Surah Detail |

---

## Back Button Behavior

| Current Route | System Back |
|--------------|-------------|
| `/home` | Exit app (or Android default) |
| `/surahs` | Go to `/home` |
| `/surah/:id` | Go to `/surahs` |
| `/library` | Go to `/home` |
| `/progress` | Go to `/home` |
| `/settings` | Go to `/home` |
| `/record/:chunkId` | Show cancel confirmation if recording in progress, then pop |
| `/onboarding` | Do nothing (cannot go back from onboarding) |
