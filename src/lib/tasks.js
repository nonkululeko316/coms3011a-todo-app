import { getDb } from '../../db/client.js';

export function updateTask(id, updates) {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) return null;

  const { title, description, due_date, topic, status } = updates;
  db.prepare(`
    UPDATE tasks
    SET title = ?, description = ?, due_date = ?, topic = ?, status = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(
    title ?? existing.title,
    description ?? existing.description,
    due_date ?? existing.due_date,
    topic ?? existing.topic,
    status ?? existing.status,
    id
  );

  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
}