import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export function getDb(dbPath = process.env.TEST_DB_PATH || path.join(process.cwd(), 'data', 'todo.db')) {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const db = new Database(dbPath);
  const schema = fs.readFileSync(path.join(process.cwd(), 'db', 'schema.sql'), 'utf-8');
  db.exec(schema);
  return db;
}