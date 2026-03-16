# 08 — SETTINGS PAGE
# SCREEN 3 — SETTINGS PAGE

## Route: `/settings`

## 3.1 PURPOSE

Central configuration for chunk generation, display preferences, default playback, data management, and app personalization. Organized into collapsible sections.

## 3.2 ASCII WIREFRAME

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│ ┌─ APP BAR ──────────────────────────────────────────────┐   │
│ │              ⚙️  Settings                               │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│  ── 📖 CHUNK CONFIGURATION ─────────────────────────────     │
│                                                              │
│  Chunk Size              ◀  [ 7 verses ]  ▶                  │
│  Overlap                 ◀  [ 2 verses ]  ▶                  │
│                                                              │
│  ⚠ Changes affect new surahs only.                           │
│  Existing surahs: tap "Regenerate" in surah detail.          │
│                                                              │
│  ── 🔄 HIFZ ORDER ─────────────────────────────────────      │
│                                                              │
│  ◉  Forward (Fatiha → Nas)                                   │
│  ○  Reverse (Nas → Fatiha)                                   │
│  ○  Revelation Order (Forward)                               │
│  ○  Revelation Order (Reverse)                               │
│  ○  Custom Order                                  [Edit ▶]   │
│                                                              │
│  ── 🌐 DISPLAY ────────────────────────────────────────      │
│                                                              │
│  Interface Language           [ English          ▼ ]         │
│  Translation Language         [ English          ▼ ]         │
│                                                              │
│  Show Arabic                  ━━━━━━━━━━━━━●  ON             │
│  Show Transliteration         ━━━━━━━━━━━━━●  ON             │
│  Show Translation             ━━━━━━━━━━━━━●  ON             │
│  Show Tafsir (on tap)         ━━━━━━━━━━━━━●  ON             │
│                                                              │
│  Arabic Font Size             ◀  [ 28sp ]  ▶                 │
│  Arabic Font                  [ Amiri Quran      ▼ ]         │
│                                                              │
│  ── 🎵 DEFAULT PLAYBACK ──────────────────────────────       │
│                                                              │
│  Speed                        ◀  [ 1.0x ]  ▶                 │
│  Verse Repetition             ◀  [  3   ]  ▶                 │
│  Chunk Repetition             ◀  [  1   ]  ▶                 │
│  Inter-Verse Gap              ◀  [ 1.0s ]  ▶                 │
│  Default Ambience             [ None             ▼ ]         │
│  Ambience Volume              ──────────●──────── 60%        │
│  Auto-Advance Chunk           ━━━━━━━━━━━━━●  ON             │
│                                                              │
│  ── 🎤 RECORDING ──────────────────────────────────────      │
│                                                              │
│  Audio Quality                [ High (AAC 128k)  ▼ ]         │
│  Auto-Silence Detection       ━━━━━━━━━━━━━●  ON             │
│  Waveform Style               [ Bars             ▼ ]         │
│                                                              │
│  ── 🎨 APPEARANCE ─────────────────────────────────────      │
│                                                              │
│  Theme                        [ System Default   ▼ ]         │
│  Islamic Patterns             ━━━━━━━━━━━━━●  ON             │
│  Accent Color                 [ Gold             ▼ ]         │
│                                                              │
│  ── 💾 DATA & STORAGE ─────────────────────────────────      │
│                                                              │
│  Storage Used                 247 MB (128 recordings)        │
│  ╭────────────────────────────────────────────────╮          │
│  │  📤  Export All Data                            │          │
│  ╰────────────────────────────────────────────────╯          │
│  ╭────────────────────────────────────────────────╮          │
│  │  📥  Import Data                                │          │
│  ╰────────────────────────────────────────────────╯          │
│  ╭────────────────────────────────────────────────╮          │
│  │  🗑️  Clear All Recordings              ⚠       │          │
│  ╰────────────────────────────────────────────────╯          │
│  ╭────────────────────────────────────────────────╮          │
│  │  🔄  Reset All Progress                 ⚠       │          │
│  ╰────────────────────────────────────────────────╯          │
│  ╭────────────────────────────────────────────────╮          │
│  │  💣  Reset Everything                   ⚠⚠      │          │
│  ╰────────────────────────────────────────────────╯          │
│                                                              │
│  ── ℹ️ ABOUT ──────────────────────────────────────────      │
│                                                              │
│  Version                      1.0.0 (build 42)              │
│  Quran Data                   Tanzil.net (verified)          │
│  ╭────────────────────────────────────────────────╮          │
│  │  📝  Send Feedback                              │          │
│  ╰────────────────────────────────────────────────╯          │
│  ╭────────────────────────────────────────────────╮          │
│  │  ⭐  Rate App                                   │          │
│  ╰────────────────────────────────────────────────╯          │
│  ╭────────────────────────────────────────────────╮          │
│  │  📜  Licenses & Credits                         │          │
│  ╰────────────────────────────────────────────────╯          │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│   🏠        📖        📑        📊        ⚙️               │
│                                              ━━              │
└──────────────────────────────────────────────────────────────┘
```

## 3.3 ALL SETTINGS — COMPLETE TABLE

### Chunk Configuration

| Setting | Widget | Options | Default | Notes |
|---------|--------|---------|---------|-------|
| Chunk Size | Stepper | 1, 3, 5, **7**, 10, 15, 20 | 7 | Only affects new surahs. Shows warning text. |
| Overlap | Stepper | 0, 1, **2**, 3, 5 | 2 | Must be < chunk size. Validated. |

### Hifz Order

| Setting | Widget | Options | Default |
|---------|--------|---------|---------|
| Order | Radio group | Forward, Reverse, Nuzul Forward, Nuzul Reverse, Custom | Forward |
| Custom Order | Reorderable list (behind "Edit" button) | Drag-and-drop surah list | — |

### Display

| Setting | Widget | Options | Default |
|---------|--------|---------|---------|
| Interface Language | Dropdown | en, ar, fr, es, de, tr, ur, id, ms, bn, so | en |
| Translation Language | Dropdown | Same as above (independent from interface) | en |
| Show Arabic | Switch | on/off | on |
| Show Transliteration | Switch | on/off | on |
| Show Translation | Switch | on/off | on |
| Show Tafsir | Switch | on/off | on |
| Arabic Font Size | Stepper | 20, 24, **28**, 32, 36, 40, 48 | 28 |
| Arabic Font | Dropdown | Amiri Quran, Scheherazade, KFGQPC Uthmanic, Noto Naskh Arabic | Amiri Quran |

### Default Playback

| Setting | Widget | Options | Default |
|---------|--------|---------|---------|
| Speed | Stepper | 0.5, 0.75, **1.0**, 1.25, 1.5, 2.0 | 1.0 |
| Verse Repetition | Stepper | 1, 2, **3**, 5, 10, 20 | 3 |
| Chunk Repetition | Stepper | **1**, 2, 3, 5, 10, ∞ | 1 |
| Inter-Verse Gap | Stepper | 0s, 0.5s, **1.0s**, 1.5s, 2.0s, 3.0s, 5.0s | 1.0s |
| Default Ambience | Dropdown | **None**, Rain, Hall, Ocean, Forest, Night | None |
| Ambience Volume | Slider | 0–100% | 60% |
| Auto-Advance Chunk | Switch | on/off | **on** |

### Recording

| Setting | Widget | Options | Default |
|---------|--------|---------|---------|
| Audio Quality | Dropdown | Low (AAC 64k), **High (AAC 128k)**, Lossless (WAV) | High |
| Auto-Silence Detection | Switch | on/off | on |
| Waveform Style | Dropdown | **Bars**, Line, Circle | Bars |

### Appearance

| Setting | Widget | Options | Default |
|---------|--------|---------|---------|
| Theme | Dropdown | Light, Dark, **System Default** | System |
| Islamic Patterns | Switch | on/off | on |
| Accent Color | Dropdown | **Gold**, Emerald, Sapphire, Ruby, Silver | Gold |

### Data & Storage

| Action | Button Style | Confirmation | Behavior |
|--------|-------------|--------------|----------|
| Export All Data | Outlined, neutral | No | Creates a zip: `hifz_backup_{date}.zip` containing all recordings + JSON metadata. Triggers system share sheet. |
| Import Data | Outlined, neutral | No | Opens file picker for `.zip` backup file. Merges or overwrites (user choice). |
| Clear All Recordings | Outlined, **red text** | ⚠ "Delete all {N} recordings ({size})? This cannot be undone." | Deletes all audio files + recording metadata. Chunk progress preserved. |
| Reset All Progress | Outlined, **red text** | ⚠ "Reset all chunk progress? Recordings will be kept." | Marks all chunks as not-started. |
| Reset Everything | Outlined, **red text, bold** | ⚠⚠ Double confirmation: "This will delete ALL recordings, progress, and settings. Type DELETE to confirm." | Nuclear reset. Returns app to fresh state. |

---
