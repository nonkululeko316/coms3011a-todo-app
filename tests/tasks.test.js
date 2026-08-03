import { createTask, listTasks, archiveTask, updateTask } from '../src/lib/tasks.js';
import { getDb } from '../db/client.js';
import path from 'path';

const testDbPath = path.join(process.cwd(), 'data', 'test.db');
process.env.TEST_DB_PATH = testDbPath;

beforeEach(() => {
  const db = getDb();
  db.exec('DELETE FROM tasks');
});

test('createTask creates a task with all four fields', () => {
  const task = createTask({ title: 'Test', description: 'Desc', due_date: '2026-08-10', topic: 'CS' });
  expect(task.title).toBe('Test');
  expect(task.status).toBe('todo');
  expect(task.archived_at).toBeNull();
});

test('archiveTask sets archived_at and excludes task from active list', () => {
  const task = createTask({ title: 'ToArchive', due_date: '2026-08-10', topic: 'CS' });
  archiveTask(task.id);
  const active = listTasks();
  expect(active.find(t => t.id === task.id)).toBeUndefined();
});

test('overdue is derived correctly for a past due date', () => {
  const task = createTask({ title: 'Overdue', due_date: '2026-01-01', topic: 'CS' });
  const tasks = listTasks();
  const found = tasks.find(t => t.id === task.id);
  expect(found.isOverdue).toBe(true);
});