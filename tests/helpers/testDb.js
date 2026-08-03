import { getDb } from '../../db/client.js';
import fs from 'fs';
import path from 'path';

export function createTestDb() {
  const testPath = path.join(process.cwd(), 'data', `test-${Date.now()}.db`);
  const db = getDb(testPath);
  return { db, testPath };
}

export function cleanupTestDb(testPath) {
  if (fs.existsSync(testPath)) fs.unlinkSync(testPath);
}