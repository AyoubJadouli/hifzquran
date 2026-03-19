{
  "name": "Recording",
  "type": "object",
  "properties": {
    "chunk_id": {
      "type": "string",
      "description": "Reference to the chunk entity"
    },
    "name": {
      "type": "string",
      "description": "User-given name for this recording"
    },
    "surah_number": {
      "type": "number",
      "description": "Surah number for quick reference"
    },
    "start_verse": {
      "type": "number"
    },
    "end_verse": {
      "type": "number"
    },
    "verse_files": {
      "type": "array",
      "description": "Array of verse audio file references",
      "items": {
        "type": "object",
        "properties": {
          "verse_number": {
            "type": "number"
          },
          "file_url": {
            "type": "string"
          },
          "duration_ms": {
            "type": "number"
          }
        }
      }
    },
    "total_duration_ms": {
      "type": "number",
      "description": "Total duration in milliseconds"
    }
  },
  "required": [
    "chunk_id",
    "name"
  ]
}