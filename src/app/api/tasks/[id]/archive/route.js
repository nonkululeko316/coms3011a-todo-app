import { NextResponse } from 'next/server';
import { archiveTask } from '../../../../../lib/tasks.js';

export async function POST(request, { params }) {
  const { id } = await params;
  const archived = archiveTask(id);

  if (!archived) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
  return NextResponse.json(archived);
}