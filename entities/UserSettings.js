{
  "name": "UserSettings",
  "type": "object",
  "properties": {
    "chunk_size": {
      "type": "number",
      "default": 7,
      "description": "Number of verses per chunk"
    },
    "chunk_overlap": {
      "type": "number",
      "default": 2,
      "description": "Overlap verses between chunks"
    },
    "hifz_order": {
      "type": "string",
      "enum": [
        "forward",
        "reverse",
        "revelation_forward",
        "revelation_reverse"
      ],
      "default": "forward"
    },
    "display_language": {
      "type": "string",
      "enum": [
        "en",
        "ar",
        "fr",
        "es",
        "de",
        "tr",
        "ur",
        "id"
      ],
      "default": "en"
    },
    "show_arabic": {
      "type": "boolean",
      "default": true
    },
    "show_transliteration": {
      "type": "boolean",
      "default": true
    },
    "show_translation": {
      "type": "boolean",
      "default": true
    },
    "default_speed": {
      "type": "number",
      "default": 1.0
    },
    "default_verse_repetition": {
      "type": "number",
      "default": 3
    },
    "default_chunk_repetition": {
      "type": "number",
      "default": 1,
      "description": "0 means infinite"
    },
    "last_chunk_id": {
      "type": "string",
      "description": "ID of last accessed chunk"
    },
    "last_surah_number": {
      "type": "number"
    }
  },
  "required": []
}