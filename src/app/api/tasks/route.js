import { NextResponse } from 'next/server';
import { createTask, listTasks } from '../../../lib/tasks.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get('sort');
  const tasks = listTasks(sortBy);
  return NextResponse.json(tasks);
}

export async function POST(request) {
  const body = await request.json();
  const { title, description, due_date, topic } = body;

  if (!title || !due_date || !topic) {
    return NextResponse.json(
      { error: 'title, due_date, and topic are required' },
      { status: 400 }
    );
  }

  const task = createTask({ title, description, due_date, topic });
  return NextResponse.json(task, { status: 201 });
}