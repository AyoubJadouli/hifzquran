{
  "name": "Chunk",
  "type": "object",
  "properties": {
    "surah_number": {
      "type": "number",
      "description": "Surah number (1-114)"
    },
    "start_verse": {
      "type": "number",
      "description": "Starting verse number"
    },
    "end_verse": {
      "type": "number",
      "description": "Ending verse number"
    },
    "status": {
      "type": "string",
      "enum": [
        "not_started",
        "in_progress",
        "completed"
      ],
      "default": "not_started",
      "description": "Memorization status"
    },
    "chunk_index": {
      "type": "number",
      "description": "Index of chunk within the surah"
    },
    "last_accessed": {
      "type": "string",
      "format": "date-time",
      "description": "Last time this chunk was accessed"
    }
  },
  "required": [
    "surah_number",
    "start_verse",
    "end_verse",
    "chunk_index"
  ]
}