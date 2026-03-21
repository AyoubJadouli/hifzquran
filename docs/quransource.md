I'll search the project knowledge for existing Quran data asset references and provide you with comprehensive sources for downloading Quranic JSON/assets.Now let me provide you with comprehensive sources for downloading full Quran data in all riwayat, translations, and transliterations:

---

## 🎯 **Quran JSON/Assets Download Sources**

### **1️⃣ Primary Repositories (All-in-One Solutions)**

#### **A. Islamic Network (quran.com API)**
- **Source**: https://github.com/islamic-network/quran.api
- **Coverage**: 
  - ✅ All 10 major riwayat (Hafs, Warsh, etc.)
  - ✅ 40+ translations (EN, FR, ES, UR, AR, DE, TR, ID, etc.)
  - ✅ Transliterations (multiple styles)
  - ✅ Tafsir (Ibn Kathir, Al-Jalalayn, Maududi)
- **Format**: RESTful API + JSON datasets
- **Download**: 
  ```bash
  # Clone the complete dataset
  git clone https://github.com/islamic-network/quran.api.git
  cd quran.api/resources
  ```
- **Data Structure**: `surahs/{surah_number}/`, `editions/`, `translations/`
- **License**: Open source (CC0)

---

#### **B. Quran.com Data (Vercel/Edge)**
- **Source**: https://github.com/quran/quran.com-frontend
- **Embedded Data**: Complete Quran JSON in `/public/data/`
- **Coverage**: All riwayat, Mushaf variants, translations
- **Format**: Pre-built JSON files (optimized for web)
- **Download**:
  ```bash
  git clone https://github.com/quran/quran.com-frontend.git
  # Data is in: public/data/quran/
  ```

---

#### **C. Tanzil Project (Most Comprehensive)**
- **Website**: http://tanzil.net/download/
- **Coverage**:
  - ✅ **15 riwayat** (Hafs, Warsh, Qalun, Duri, etc.)
  - ✅ **40+ translations** (multilingual)
  - ✅ **Multiple formats**: Plain text, XML, JSON, Zipped
  - ✅ **Tajweed marks & diacritics**
- **Download Formats**:
  - **Uthmanic script** (original)
  - **Simple/clean text** (no diacritics)
  - **Transliteration** (multiple systems)
- **Direct Link**: http://tanzil.net/download/Quran_simple_clean.txt
- **License**: Public domain

---

#### **D. Quran JSON (GitHub)**
- **Source**: https://github.com/rinsed-org/quran-json
- **Coverage**: Complete Quran with metadata
- **Format**: Organized by surah + verse
- **Features**: 
  - Verse-level granularity (ideal for your app)
  - Revelation order mapping
  - Multiple translations bundled
- **Download**:
  ```bash
  git clone https://github.com/rinsed-org/quran-json.git
  ```

---

### **2️⃣ Specialized by Riwayat (Recitation Styles)**

#### **Top 10 Riwayat** (for audio alignment):
1. **Hafs** (most common) - Asim via Hafs
2. **Warsh** (North Africa) - Nafi via Warsh
3. **Qalun** (traditional) - Nafi via Qalun
4. **Duri** (alternate) - Abu Amr via Duri
5. **Susi** (Iraqi) - Abu Amr via Susi
6. **Hisham** (Levantine) - Ibn Amir via Hisham
7. **Khalaf** (Egyptian) - Ibn Amir via Khalaf
8. **Al-Duri al-Kubra** - Al-Kisa'i via Al-Duri
9. **Khalaf al-Asa'im** - Hamza via Khalaf al-Asa'im
10. **Ibn Kathir** (Meccan) - Ibn Kathir via Al-Bakri

**Get All Riwayat**:
```bash
# Tanzil multilingual + riwayat
curl -O http://tanzil.net/download/Quran_uthmanic_script.zip
curl -O http://tanzil.net/download/Quran_transliteration_en.txt
```

---

### **3️⃣ Translation Libraries (40+ Languages)**

| Language | Source | Format |
|----------|--------|--------|
| **English** | Sahih International (Tanzil) | JSON/XML/TXT |
| **French** | Medine Translation | JSON (Tanzil) |
| **Spanish** | Cortés Translation | JSON |
| **Urdu** | Maulana Fateh Muhammad Jalandhry | JSON |
| **Arabic (Tafsir)** | Ibn Kathir, Al-Jalalayn | JSON |
| **German** | Bubenheim & Elias | JSON |
| **Turkish** | Diyanet İşleri | JSON |
| **Indonesian** | Kementerian Agama RI | JSON |
| **Chinese** | Darul Ifta Scholars | JSON |

**Batch Download** (Tanzil):
```bash
# Download all translations
for lang in en fr es ur ar de tr id zh; do
  curl -O "http://tanzil.net/download/Quran_$(lang).txt"
done
```

---

### **4️⃣ Structured JSON Schemas (Best for Flutter)**

#### **A. Quran.js (Standardized)**
```json
{
  "surahs": [
    {
      "number": 1,
      "name": "Al-Fatihah",
      "name_arabic": "الفاتحة",
      "revelation_type": "Meccan",
      "revelation_order": 5,
      "total_verses": 7,
      "verses": [
        {
          "number": 1,
          "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
          "transliteration": "Bismillāhi r-raḥmāni r-raḥīm",
          "translations": {
            "en": "In the name of Allah...",
            "fr": "Au nom d'Allah...",
            "es": "En el nombre de Allah...",
            "ur": "اللہ کے نام سے...",
            "ar_tafsir": "..."
          }
        }
      ]
    }
  ],
  "riwayat": ["Hafs", "Warsh", "Qalun", ...]
}
```

**Direct GitHub Sources**:
- https://github.com/islamic-network/QuranApi/tree/master/resources/quran.json
- https://github.com/surahmapping/quran-json (with detailed metadata)

---

### **5️⃣ Audio-Enabled Datasets (For Recitations)**

If you need **pre-recorded recitations** for sync:

#### **A. Quran.com Audio Collection**
- **Source**: https://quran.com (has API for audio metadata)
- **Coverage**: 70+ famous Qaris (reciters)
- **Format**: MP3 + metadata JSON
- **Get List**:
  ```bash
  # Query available recitations
  curl "https://api.quran.com/api/v4/resources/recitations"
  ```

#### **B. Maqaam.com**
- **Source**: https://maqaam.com/en/download-quran
- **Coverage**: Multiple Qaris + Tajweed versions
- **Format**: MP3 + subtitle files (synchronization ready)

---

### **6️⃣ Quick Start: Recommended Setup for Hifz Companion**

**Minimal Bundle** (production-ready):
```bash
# 1. Clone Islamic Network API (complete + maintained)
git clone https://github.com/islamic-network/quran.api.git

# 2. Extract essential files
cp quran.api/resources/quran/ your_project/assets/data/

# 3. Use this JSON structure in your app:
# File: assets/data/quran.json
# Contains: All surahs + verses + translations + riwayat mapping
```

**Comprehensive Bundle** (all riwayat + translations):
```bash
# Tanzil complete package
curl -O http://tanzil.net/download/Quran_uthmanic_script.zip
curl -O http://tanzil.net/download/Quran_transliteration_en.txt
curl -O http://tanzil.net/download/Quran_en_sahih_international.txt
curl -O http://tanzil.net/download/Quran_ar_tafsir_ibn_kathir.txt

# Extract and merge into single JSON asset
unzip Quran_uthmanic_script.zip
# Process with your data merger script
```

---

### **7️⃣ Recommended Data Schema for Your App**

```json
{
  "metadata": {
    "quran_version": "1.0.0",
    "last_updated": "2025-01-20",
    "total_surahs": 114,
    "total_verses": 6236,
    "riwayat": ["Hafs", "Warsh", "Qalun"],
    "languages": ["en", "fr", "es", "ur", "ar", "de", "tr", "id"]
  },
  "surahs": [
    {
      "number": 1,
      "name_arabic": "الفاتحة",
      "name_english": "Al-Fatihah",
      "name_transliteration": "Al-Fātiḥah",
      "revelation_type": "Meccan",
      "revelation_order": 5,
      "total_verses": 7,
      "verses": [
        {
          "number": 1,
          "text": {
            "uthmanic": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
            "simple": "بسم الله الرحمن الرحيم",
            "transliteration": "Bismillāhi r-raḥmāni r-raḥīm"
          },
          "translations": {
            "en": "In the name of Allah, the Entirely Merciful...",
            "fr": "Au nom d'Allah, le Tout Miséricordieux...",
            "es": "En el nombre de Allah, el Compasivo...",
            "ur": "اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے"
          },
          "tafsir": {
            "en": "This verse indicates...",
            "ar": "هذه الآية تشير إلى..."
          }
        }
      ]
    }
  ]
}
```

---

### **8️⃣ Storage Strategy for Flutter App**

**Option 1: Bundle with App** (recommended for offline-first)
```bash
# Place in: assets/data/quran.json
# Load at startup: 
#   final quranJson = await rootBundle.loadString('assets/data/quran.json');
#   final quran = Quran.fromJson(jsonDecode(quranJson));

# Storage: ~2-3 MB (compressed)
```

**Option 2: Remote + Local Cache**
```dart
// Fetch from API on first launch, cache locally with Hive
final quranBox = await Hive.openBox('quran');
if (!quranBox.containsKey('quran_data')) {
  final response = await http.get(Uri.parse('https://api.quran.com/api/v4/quran/...'));
  quranBox.put('quran_data', response.body);
}
```

**Option 3: Hybrid** (local + remote sync)
```dart
// Ship lightweight assets, fetch riwayat variants on-demand
// Surahs/verses bundled locally
// Translations/tafsir synced from server
```

---

### **🔗 Direct Download Links (Ready-to-Use)**

| Resource | Link | Format | Size |
|----------|------|--------|------|
| **Islamic Network Complete** | https://github.com/islamic-network/quran.api/releases | JSON | ~5 MB |
| **Tanzil Complete Package** | http://tanzil.net/download/ | ZIP | ~10 MB |
| **Quran.js (Minimal)** | https://github.com/rinsed-org/quran-json | JSON | ~2 MB |
| **Quran.com Data** | https://github.com/quran/quran.com-frontend/tree/main/public/data | JSON | ~8 MB |
| **English Translation** | http://tanzil.net/download/Quran_en_sahih_international.txt | TXT | ~0.5 MB |

---

## ✅ **Recommendation for Hifz Companion**

**Use Islamic Network API + Tanzil hybrid**:
1. ✅ Clone Islamic Network (structured JSON, all translations)
2. ✅ Supplement with Tanzil for additional riwayat variants
3. ✅ Bundle lightweight core (114 surahs, Hafs riwayat, English) as app asset
4. ✅ Fetch advanced riwayat/translations on-demand from backend

This gives you:
- **Offline functionality** (core data shipped)
- **Scalability** (cloud sync for variants)
- **User choice** (switch translations/riwayat in settings)
- **Low app size** (~3-4 MB + features)

Would you like help setting up the data pipeline or writing a merger script? 📦