import { NextResponse } from 'next/server';
import { listArchivedTasks } from '../../../../lib/tasks.js';

export async function GET() {
  const tasks = listArchivedTasks();
  return NextResponse.json(tasks);
}