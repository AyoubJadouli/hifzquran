const PUBLIC_QURAN_BASE = "/quran";

const RIWAYA_ASSET_EDITIONS = {
  warsh: ["quran-warsh"],
  hafs: ["quran-uthmani"],
  qalun: ["quran-qalun"],
  al_duri: ["quran-douri"],
};

export const SUPPORTED_RIWAYAT = {
  warsh: { id: "warsh", label: "Warsh ʿan Nāfiʿ", shortLabel: "Warsh" },
  hafs: { id: "hafs", label: "Ḥafṣ ʿan ʿĀṣim", shortLabel: "Hafs" },
  qalun: { id: "qalun", label: "Qālūn ʿan Nāfiʿ", shortLabel: "Qalun" },
  al_duri: { id: "al_duri", label: "Al-Dūrī ʿan Abī ʿAmr", shortLabel: "Al-Duri" },
};

const TRANSLATION_EDITIONS = {
  en: "quran-en",
  fr: "quran-fr",
  es: "quran-es",
  ur: "quran-ur",
  tr: "quran-tr",
  id: "quran-id",
  ar: null,
};

const TRANSLITERATION_EDITIONS = {
  standard: {
    en: "quran-transliteration-en",
  },
  simplified: {
    en: "quran-transliteration-en",
  },
};

export const SUPPORTED_TRANSLITERATION_SOURCES = {
  standard: { id: "standard", label: "Standard Transliteration" },
  simplified: { id: "simplified", label: "Simplified Transliteration" },
};

export const SUPPORTED_TRANSLITERATION_LANGUAGES = {
  en: { id: "en", label: "English Transliteration" },
};

const cache = {
  surahList: null,
  surahs: {},
  surahsByLang: {},
  assets: {},
};

function lsGet(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}

function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function assetUrl(assetName) {
  return `${PUBLIC_QURAN_BASE}/${assetName}.json`;
}

async function loadAsset(assetName) {
  if (!assetName) return null;
  if (cache.assets[assetName]) return cache.assets[assetName];

  const res = await fetch(assetUrl(assetName));
  if (!res.ok) throw new Error(`Failed to fetch asset ${assetName}`);
  const data = await res.json();
  cache.assets[assetName] = data;
  return data;
}

async function loadFirstAvailableAsset(assetNames) {
  let lastError = null;
  for (const assetName of assetNames) {
    try {
      return await loadAsset(assetName);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("No local Quran asset available");
}

function getSurahFromAsset(asset, surahNumber) {
  return asset?.data?.surahs?.find((surah) => surah.number === surahNumber) || null;
}

function getTransliterationEdition(language = "en", source = "standard") {
  const sourceMap = TRANSLITERATION_EDITIONS[source] || TRANSLITERATION_EDITIONS.standard;
  return sourceMap[language] || TRANSLITERATION_EDITIONS.standard.en;
}

export async function fetchSurahList() {
  if (cache.surahList) return cache.surahList;

  const cached = lsGet("quran_surah_list");
  if (cached) {
    cache.surahList = cached;
    return cached;
  }

  const baseAsset = await loadAsset("quran-uthmani");
  cache.surahList = baseAsset.data.surahs.map((s) => ({
    number: s.number,
    name_arabic: s.name,
    name_english: s.englishName,
    name_translation: s.englishNameTranslation,
    total_verses: s.ayahs.length,
    revelation_type: s.revelationType,
  }));

  lsSet("quran_surah_list", cache.surahList);
  return cache.surahList;
}

export async function fetchSurahVerses(surahNumber, language = "en") {
  return fetchSurahVersesForLanguage(surahNumber, language, "warsh");
}

export async function fetchSurahVersesForLanguage(
  surahNumber,
  language = "en",
  riwaya = "warsh",
  transliterationLanguage = "en",
  transliterationSource = "standard"
) {
  const lang = TRANSLATION_EDITIONS[language] ? language : "en";
  const riwayaKey = RIWAYA_ASSET_EDITIONS[riwaya] ? riwaya : "warsh";
  const translitLang = SUPPORTED_TRANSLITERATION_LANGUAGES[transliterationLanguage] ? transliterationLanguage : "en";
  const translitSource = SUPPORTED_TRANSLITERATION_SOURCES[transliterationSource] ? transliterationSource : "standard";
  const cacheKey = `${surahNumber}_${lang}_${riwayaKey}_${translitLang}_${translitSource}`;

  if (cache.surahsByLang[cacheKey]) return cache.surahsByLang[cacheKey];

  const lsKey = `quran_surah_${cacheKey}`;
  const cached = lsGet(lsKey);
  if (cached) {
    cache.surahsByLang[cacheKey] = cached;
    return cached;
  }

  const [arabicAsset, translationAsset, transliterationAsset] = await Promise.all([
    loadFirstAvailableAsset(RIWAYA_ASSET_EDITIONS[riwayaKey]),
    lang === "ar" ? Promise.resolve(null) : loadAsset(TRANSLATION_EDITIONS[lang]),
    loadAsset(getTransliterationEdition(translitLang, translitSource)).catch(() => null),
  ]);

  const arabicSurah = getSurahFromAsset(arabicAsset, surahNumber);
  if (!arabicSurah) throw new Error(`Surah ${surahNumber} not found in Arabic asset`);

  const translationSurah = getSurahFromAsset(translationAsset, surahNumber);
  const transliterationSurah = getSurahFromAsset(transliterationAsset, surahNumber);

  const verses = arabicSurah.ayahs.map((ayah, i) => ({
    number: ayah.numberInSurah,
    arabic: ayah.text,
    translation: translationSurah?.ayahs?.[i]?.text || "",
    transliteration: transliterationSurah?.ayahs?.[i]?.text || "",
    audio_url: null,
  }));

  const surahPayload = {
    number: arabicSurah.number,
    name_arabic: arabicSurah.name,
    name_english: arabicSurah.englishName,
    name_translation: arabicSurah.englishNameTranslation,
    total_verses: arabicSurah.ayahs.length,
    revelation_type: arabicSurah.revelationType,
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
  const langs = Array.from(new Set(languages.filter((l) => TRANSLATION_EDITIONS[l] || l === "ar")));
  const selectedRiwayat = Array.from(new Set(riwayat.filter((r) => RIWAYA_ASSET_EDITIONS[r])));
  const selectedTranslitLangs = Array.from(new Set(transliterationLanguages.filter((l) => SUPPORTED_TRANSLITERATION_LANGUAGES[l])));
  const selectedTranslitSources = Array.from(new Set(transliterationSources.filter((s) => SUPPORTED_TRANSLITERATION_SOURCES[s])));

  const neededAssets = new Set(["quran-uthmani", ...selectedRiwayat.flatMap((r) => RIWAYA_ASSET_EDITIONS[r])]);
  langs.forEach((lang) => {
    if (TRANSLATION_EDITIONS[lang]) neededAssets.add(TRANSLATION_EDITIONS[lang]);
  });
  selectedTranslitLangs.forEach((lang) => {
    selectedTranslitSources.forEach((source) => {
      neededAssets.add(getTransliterationEdition(lang, source));
    });
  });

  await Promise.all(Array.from(neededAssets).map((assetName) => loadAsset(assetName).catch(() => null)));

  const total = 114 * langs.length * selectedRiwayat.length * selectedTranslitLangs.length * selectedTranslitSources.length;
  return {
    completed: total,
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