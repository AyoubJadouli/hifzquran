import { useState, useEffect, useCallback } from "react";
import { localEntities } from "./localData";

const DEFAULT_SETTINGS = {
  chunk_size: 7,
  chunk_overlap: 2,
  hifz_order: "forward",
  display_language: "en",
  show_arabic: true,
  show_transliteration: true,
  show_translation: true,
  default_speed: 1.0,
  default_verse_repetition: 1,
  default_chunk_repetition: 0,
  recite_prompt_threshold: 10,
  last_chunk_id: null,
  last_surah_number: null,
};

export function useSettings() {
  // Read synchronously from localStorage on first render to avoid stale defaults
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem("hifz_UserSettings");
      const list = raw ? JSON.parse(raw) : [];
      if (list.length > 0) return { ...DEFAULT_SETTINGS, ...list[0] };
    } catch {}
    return DEFAULT_SETTINGS;
  });
  const [settingsId, setSettingsId] = useState(() => {
    try {
      const raw = localStorage.getItem("hifz_UserSettings");
      const list = raw ? JSON.parse(raw) : [];
      if (list.length > 0) return list[0].id;
    } catch {}
    return null;
  });
  const [loading, setLoading] = useState(false);

  async function loadSettings() {
    const list = await localEntities.UserSettings.list();
    if (list.length > 0) {
      setSettings({ ...DEFAULT_SETTINGS, ...list[0] });
      setSettingsId(list[0].id);
    }
  }

  const updateSettings = useCallback(async (updates) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    
    const { id, created_date, updated_date, created_by, ...saveData } = newSettings;
    
    if (settingsId) {
      await localEntities.UserSettings.update(settingsId, saveData);
    } else {
      const created = await localEntities.UserSettings.create(saveData);
      setSettingsId(created.id);
    }
  }, [settings, settingsId]);

  return { settings, updateSettings, loading };
}