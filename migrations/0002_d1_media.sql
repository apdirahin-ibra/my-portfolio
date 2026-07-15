CREATE TABLE IF NOT EXISTS portfolio_media (
  id TEXT PRIMARY KEY,
  data BLOB NOT NULL,
  content_type TEXT NOT NULL,
  original_name TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS portfolio_media_created_idx
  ON portfolio_media (created_at DESC);
