// Quran data fetching utilities using Al-Quran Cloud API
const API_BASE = "https://api.alquran.cloud/v1";
const ARABIC_WARSH_EDITION = "ar.warsh";
const ARABIC_FALLBACK_EDITION = "ar.alafasy";

const TRANSLATION_EDITIONS = {
  en: "en.asad",
  fr: "fr.hamidullah",
  es: "es.cortes",
  ur: "ur.jalandhry",
  tr: "tr.diyanet",
  id: "id.indonesian",
  ar: null,
};

const TRANSLITERATION_EDITION = "en.transliteration";

// In-memory cache
const cache = {
  surahList: null,
  surahs: {},
  surahsByLang: {},
};

// localStorage helpers for persistent caching
function lsGet(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export async function fetchSurahList() {
  if (cache.surahList) return cache.surahList;
  const cached = lsGet("quran_surah_list");
  if (cached) { cache.surahList = cached; return cached; }
  const res = await fetch(`${API_BASE}/surah`);
  const data = await res.json();
  cache.surahList = data.data.map((s) => ({
    number: s.number,
    name_arabic: s.name,
    name_english: s.englishName,
    name_translation: s.englishNameTranslation,
    total_verses: s.numberOfAyahs,
    revelation_type: s.revelationType,
  }));
  lsSet("quran_surah_list", cache.surahList);
  return cache.surahList;
}

export async function fetchSurahVerses(surahNumber, language = "en") {
  return fetchSurahVersesForLanguage(surahNumber, language);
}

async function fetchEditionJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch edition: ${url}`);
  return res.json();
}

export async function fetchSurahVersesForLanguage(surahNumber, language = "en") {
  const lang = TRANSLATION_EDITIONS[language] ? language : "en";
  const cacheKey = `${surahNumber}_${lang}`;
  if (cache.surahsByLang[cacheKey]) return cache.surahsByLang[cacheKey];
  const lsKey = `quran_surah_${surahNumber}_${lang}`;
  const cached = lsGet(lsKey);
  if (cached) {
    cache.surahsByLang[cacheKey] = cached;
    return cached;
  }

  // Fetch Arabic (Warsh preferred), translation, and transliteration in parallel
  const [arabicData, translationData, transliterationData] = await Promise.all([
    fetchEditionJson(`${API_BASE}/surah/${surahNumber}/${ARABIC_WARSH_EDITION}`).catch(() =>
      fetchEditionJson(`${API_BASE}/surah/${surahNumber}/${ARABIC_FALLBACK_EDITION}`)
    ),
    lang === "ar"
      ? Promise.resolve({ data: { ayahs: [] } })
      : fetchEditionJson(`${API_BASE}/surah/${surahNumber}/${TRANSLATION_EDITIONS[lang]}`),
    fetchEditionJson(`${API_BASE}/surah/${surahNumber}/${TRANSLITERATION_EDITION}`).catch(() =>
      Promise.resolve({ data: { ayahs: [] } })
    ),
  ]);
  
  const verses = arabicData.data.ayahs.map((ayah, i) => ({
    number: ayah.numberInSurah,
    arabic: ayah.text,
    translation: translationData?.data?.ayahs?.[i]?.text || "",
    transliteration: transliterationData?.data?.ayahs?.[i]?.text || "",
    audio_url: ayah.audio,
  }));

  const surahPayload = {
    number: arabicData.data.number,
    name_arabic: arabicData.data.name,
    name_english: arabicData.data.englishName,
    name_translation: arabicData.data.englishNameTranslation,
    total_verses: arabicData.data.numberOfAyahs,
    revelation_type: arabicData.data.revelationType,
    verses,
  };

  cache.surahs[surahNumber] = surahPayload;
  cache.surahsByLang[cacheKey] = surahPayload;
  lsSet(lsKey, surahPayload);
  return surahPayload;
}

export async function prefetchAllQuranData(languages = ["en"]) {
  const langs = Array.from(new Set(languages.filter(l => TRANSLATION_EDITIONS[l] || l === "ar")));
  let completed = 0;
  const total = 114 * langs.length;

  for (const lang of langs) {
    for (let surah = 1; surah <= 114; surah++) {
      await fetchSurahVersesForLanguage(surah, lang);
      completed += 1;
    }
  }

  return { completed, total, languages: langs };
}

export async function prefetchFullQuranWarsh(language = "en") {
  const lang = TRANSLATION_EDITIONS[language] ? language : "en";
  return prefetchAllQuranData([lang]);
}

export function generateChunks(totalVerses, chunkSize, overlap) {
  const chunks = [];
  let currentStart = 1;
  let chunkIndex = 0;

  while (currentStart <= totalVerses) {
    const isFirst = chunkIndex === 0;
    const start = isFirst ? 1 : currentStart - overlap;
    const end = Math.min(currentStart + chunkSize - 1, totalVerses);

    chunks.push({
      chunk_index: chunkIndex,
      start_verse: start,
      end_verse: end,
    });

    currentStart = end + 1;
    chunkIndex++;
  }

  return chunks;
}

export function getSurahListFromCache() {
  return cache.surahList;
}

export function getSurahFromCache(number) {
  return cache.surahs[number];
}