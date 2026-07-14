export const ensureSchema = async (db) => {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS portfolio_content (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      project_type TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare('CREATE INDEX IF NOT EXISTS contact_messages_created_idx ON contact_messages (created_at DESC)'),
  ]);
};

export const getContent = async (db) => {
  await ensureSchema(db);
  const row = await db.prepare('SELECT data FROM portfolio_content WHERE id = ?').bind('main').first();
  if (!row?.data) return null;
  return JSON.parse(row.data);
};

export const saveContent = async (db, content) => {
  await ensureSchema(db);
  await db.prepare(`INSERT INTO portfolio_content (id, data, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP`)
    .bind('main', JSON.stringify(content))
    .run();
};

export const saveMessage = async (db, message) => {
  await ensureSchema(db);
  await db.prepare(`INSERT INTO contact_messages (id, name, email, project_type, message, status)
    VALUES (?, ?, ?, ?, ?, 'new')`)
    .bind(message.id, message.name, message.email, message.projectType, message.message)
    .run();
};

export const listMessages = async (db) => {
  await ensureSchema(db);
  const result = await db.prepare(`SELECT id, name, email, project_type, message, status, created_at
    FROM contact_messages ORDER BY created_at DESC LIMIT 200`).all();
  return (result.results || []).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    projectType: row.project_type,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  }));
};
