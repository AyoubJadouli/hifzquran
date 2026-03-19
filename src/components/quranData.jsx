// Quran data fetching utilities using Al-Quran Cloud API
const API_BASE = "https://api.alquran.cloud/v1";

const RIWAYA_EDITIONS = {
  warsh: ["ar.warsh", "ar.alafasy"],
  hafs: ["quran-uthmani", "ar.alafasy"],
  qalun: ["ar.qaloun", "quran-uthmani", "ar.alafasy"],
  al_duri: ["ar.douri", "quran-uthmani", "ar.alafasy"],
};

export const SUPPORTED_RIWAYAT = {
  warsh: { id: "warsh", label: "Warsh ʿan Nāfiʿ", shortLabel: "Warsh" },
  hafs: { id: "hafs", label: "Ḥafṣ ʿan ʿĀṣim", shortLabel: "Hafs" },
  qalun: { id: "qalun", label: "Qālūn ʿan Nāfiʿ", shortLabel: "Qalun" },
  al_duri: { id: "al_duri", label: "Al-Dūrī ʿan Abī ʿAmr", shortLabel: "Al-Duri" },
};

const TRANSLATION_EDITIONS = {
  en: "en.asad",
  fr: "fr.hamidullah",
  es: "es.cortes",
  ur: "ur.jalandhry",
  tr: "tr.diyanet",
  id: "id.indonesian",
  ar: null,
};

const TRANSLITERATION_EDITIONS = {
  standard: {
    en: "en.transliteration",
  },
  simplified: {
    en: "en.transliteration",
  },
};

export const SUPPORTED_TRANSLITERATION_SOURCES = {
  standard: { id: "standard", label: "Standard Transliteration" },
  simplified: { id: "simplified", label: "Simplified Transliteration" },
};

export const SUPPORTED_TRANSLITERATION_LANGUAGES = {
  en: { id: "en", label: "English Transliteration" },
};

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
  return fetchSurahVersesForLanguage(surahNumber, language, "warsh");
}

async function fetchEditionJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch edition: ${url}`);
  return res.json();
}

async function fetchFirstAvailableEdition(surahNumber, editions) {
  let lastError = null;
  for (const edition of editions) {
    try {
      return await fetchEditionJson(`${API_BASE}/surah/${surahNumber}/${edition}`);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error(`No edition available for surah ${surahNumber}`);
}

function getTransliterationEdition(language = "en", source = "standard") {
  const sourceMap = TRANSLITERATION_EDITIONS[source] || TRANSLITERATION_EDITIONS.standard;
  return sourceMap[language] || TRANSLITERATION_EDITIONS.standard.en;
}

export async function fetchSurahVersesForLanguage(
  surahNumber,
  language = "en",
  riwaya = "warsh",
  transliterationLanguage = "en",
  transliterationSource = "standard"
) {
  const lang = TRANSLATION_EDITIONS[language] ? language : "en";
  const riwayaKey = RIWAYA_EDITIONS[riwaya] ? riwaya : "warsh";
  const translitLang = SUPPORTED_TRANSLITERATION_LANGUAGES[transliterationLanguage] ? transliterationLanguage : "en";
  const translitSource = SUPPORTED_TRANSLITERATION_SOURCES[transliterationSource] ? transliterationSource : "standard";
  const cacheKey = `${surahNumber}_${lang}_${riwayaKey}_${translitLang}_${translitSource}`;
  if (cache.surahsByLang[cacheKey]) return cache.surahsByLang[cacheKey];
  const lsKey = `quran_surah_${surahNumber}_${lang}_${riwayaKey}_${translitLang}_${translitSource}`;
  const cached = lsGet(lsKey);
  if (cached) {
    cache.surahsByLang[cacheKey] = cached;
    return cached;
  }

  // Fetch Arabic by chosen riwaya, translation, and transliteration in parallel
  const [arabicData, translationData, transliterationData] = await Promise.all([
    fetchFirstAvailableEdition(surahNumber, RIWAYA_EDITIONS[riwayaKey]),
    lang === "ar"
      ? Promise.resolve({ data: { ayahs: [] } })
      : fetchEditionJson(`${API_BASE}/surah/${surahNumber}/${TRANSLATION_EDITIONS[lang]}`),
    fetchEditionJson(`${API_BASE}/surah/${surahNumber}/${getTransliterationEdition(translitLang, translitSource)}`).catch(() =>
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
    riwaya: riwayaKey,
    transliteration_language: translitLang,
    transliteration_source: translitSource,
    verses,
  };

  cache.surahs[surahNumber] = surahPayload;
  cache.surahsByLang[cacheKey] = surahPayload;
  lsSet(lsKey, surahPayload);
  return surahPayload;
}

export async function prefetchAllQuranData(
  languages = ["en"],
  riwayat = ["warsh"],
  transliterationLanguages = ["en"],
  transliterationSources = ["standard"]
) {
  const langs = Array.from(new Set(languages.filter(l => TRANSLATION_EDITIONS[l] || l === "ar")));
  const selectedRiwayat = Array.from(new Set(riwayat.filter(r => RIWAYA_EDITIONS[r])));
  const selectedTranslitLangs = Array.from(new Set(transliterationLanguages.filter(l => SUPPORTED_TRANSLITERATION_LANGUAGES[l])));
  const selectedTranslitSources = Array.from(new Set(transliterationSources.filter(s => SUPPORTED_TRANSLITERATION_SOURCES[s])));
  let completed = 0;
  const total = 114 * langs.length * selectedRiwayat.length * selectedTranslitLangs.length * selectedTranslitSources.length;

  for (const riwaya of selectedRiwayat) {
    for (const lang of langs) {
      for (const translitLang of selectedTranslitLangs) {
        for (const translitSource of selectedTranslitSources) {
          for (let surah = 1; surah <= 114; surah++) {
            await fetchSurahVersesForLanguage(surah, lang, riwaya, translitLang, translitSource);
            completed += 1;
          }
        }
      }
    }
  }

  return {
    completed,
    total,
    languages: langs,
    riwayat: selectedRiwayat,
    transliterationLanguages: selectedTranslitLangs,
    transliterationSources: selectedTranslitSources,
  };
}

export async function prefetchFullQuranWarsh(
  language = "en",
  riwaya = "warsh",
  transliterationLanguage = "en",
  transliterationSource = "standard"
) {
  const lang = TRANSLATION_EDITIONS[language] ? language : "en";
  return prefetchAllQuranData([lang], [riwaya], [transliterationLanguage], [transliterationSource]);
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