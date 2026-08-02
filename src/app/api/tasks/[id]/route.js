import { NextResponse } from 'next/server';
import { updateTask } from '../../../../lib/tasks.js';

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const updated = updateTask(id, body);

  if (!updated) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
  return NextResponse.json(updated);
}