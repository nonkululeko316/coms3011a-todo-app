import { getDb } from '../../db/client.js';

export function createTask({ title, description, due_date, topic }) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO tasks (title, description, due_date, topic)
    VALUES (?, ?, ?, ?)
  `);
  const info = stmt.run(title, description, due_date, topic);
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid);
}

export function listTasks() {
  const db = getDb();
  return db.prepare('SELECT * FROM tasks WHERE archived_at IS NULL').all();
}