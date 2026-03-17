{
  "name": "RecitationAttempt",
  "type": "object",
  "properties": {
    "chunk_id": {
      "type": "string",
      "description": "Reference to chunk"
    },
    "attempted_at": {
      "type": "string",
      "format": "date-time"
    },
    "audio_file_path": {
      "type": "string",
      "description": "Single continuous recitation audio reference"
    },
    "duration_ms": {
      "type": "number"
    },
    "total_verses": {
      "type": "number"
    },
    "correct_verses": {
      "type": "number"
    },
    "validated": {
      "type": "boolean",
      "default": false
    },
    "attempt_number": {
      "type": "number",
      "default": 1
    }
  },
  "required": [
    "chunk_id",
    "attempted_at",
    "audio_file_path",
    "duration_ms",
    "total_verses",
    "correct_verses",
    "validated"
  ]
}