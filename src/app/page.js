'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [sortBy, setSortBy] = useState('due_date');
  const [form, setForm] = useState({ title: '', description: '', due_date: '', topic: '' });
  const [editingId, setEditingId] = useState(null);

  async function loadTasks() {
    const res = await fetch(`/api/tasks?sort=${sortBy}`);
    const data = await res.json();
    setTasks(data);
  }

  useEffect(() => { loadTasks(); }, [sortBy]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/tasks/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setEditingId(null);
    } else {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm({ title: '', description: '', due_date: '', topic: '' });
    loadTasks();
  }

  function startEdit(task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description || '',
      due_date: task.due_date,
      topic: task.topic,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ title: '', description: '', due_date: '', topic: '' });
  }

  async function archiveTask(id) {
    await fetch(`/api/tasks/${id}/archive`, { method: 'POST' });
    loadTasks();
  }

  async function updateStatus(id, status) {
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    loadTasks();
  }

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Todo App</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <fieldset>
          <legend>{editingId ? 'Edit Task' : 'New Task'}</legend>

          <label htmlFor="title">Title</label><br />
          <input
            id="title"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          /><br />

          <label htmlFor="description">Description</label><br />
          <input
            id="description"
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          /><br />

          <label htmlFor="due_date">Due Date</label><br />
          <input
            id="due_date"
            type="date"
            value={form.due_date}
            onChange={e => setForm({ ...form, due_date: e.target.value })}
            required
          /><br />

          <label htmlFor="topic">Topic</label><br />
          <input
            id="topic"
            placeholder="Topic"
            value={form.topic}
            onChange={e => setForm({ ...form, topic: e.target.value })}
            required
          /><br />

          <button type="submit">{editingId ? 'Save Edit' : 'Create Task'}</button>
          {editingId && (
            <button type="button" onClick={cancelEdit} style={{ marginLeft: '0.5rem' }}>
              Cancel
            </button>
          )}
        </fieldset>
      </form>

      <label htmlFor="sort">Sort by: </label>
      <select id="sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
        <option value="due_date">Due Date</option>
        <option value="topic">Topic</option>
        <option value="status">Status</option>
      </select>

      <section aria-label="Task list">
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
          {tasks.map(task => (
            <li key={task.id} style={{
              border: '1px solid #ccc',
              padding: '0.75rem',
              marginBottom: '0.5rem',
              background: task.isOverdue ? '#ffe5e5' : 'white',
            }}>
              <strong>{task.title}</strong>{' '}
              {task.isOverdue && <span style={{ color: 'red' }}>OVERDUE</span>}
              <div>{task.description}</div>
              <div>Due: {task.due_date} | Topic: {task.topic}</div>

              <label htmlFor={`status-${task.id}`} style={{ marginRight: '0.5rem' }}>
                Status:
              </label>
              <select
                id={`status-${task.id}`}
                value={task.status}
                onChange={e => updateStatus(task.id, e.target.value)}
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="complete">Complete</option>
              </select>

              <button onClick={() => startEdit(task)} aria-label={`Edit ${task.title}`}>
                Edit
              </button>
              <button onClick={() => archiveTask(task.id)} aria-label={`Archive ${task.title}`}>
                Archive
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}