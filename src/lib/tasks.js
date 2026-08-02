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

export function listTasks(sortBy) {
  const db = getDb();
  const allowedSorts = { topic: 'topic', status: 'status', due_date: 'due_date' };
  const column = allowedSorts[sortBy] || 'due_date';
  const tasks = db.prepare(`SELECT * FROM tasks WHERE archived_at IS NULL ORDER BY ${column}`).all();

  const today = new Date().toISOString().split('T')[0];
  return tasks.map(task => ({
    ...task,
    isOverdue: task.status !== 'complete' && task.due_date < today,
  }));
}

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

export function archiveTask(id) {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) return null;

  db.prepare(`
    UPDATE tasks SET archived_at = datetime('now'), updated_at = datetime('now') WHERE id = ?
  `).run(id);

  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
}