'use client';
import { useState, useEffect } from 'react';

// Signature status indicator: a leaf that fills as a task progresses.
// todo = outline only, in-progress = half-filled, complete = fully filled.
function LeafIcon({ status }) {
  const fillLevel = status === 'complete' ? 1 : status === 'in-progress' ? 0.5 : 0;
  const fillColor = status === 'complete' ? '#4CAF50' : '#A3C9A8';

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className="leaf-icon" aria-hidden="true">
      <path
        d="M12 2C7 4 3 8 3 14c0 4 3.5 7 9 8 5.5-1 9-4 9-8 0-6-4-10-9-12z"
        fill="none"
        stroke="#8FA893"
        strokeWidth="1.4"
      />
      {fillLevel > 0 && (
        <clipPath id={`clip-${status}`}>
          <rect x="0" y={24 - 24 * fillLevel} width="24" height="24" />
        </clipPath>
      )}
      {fillLevel > 0 && (
        <path
          d="M12 2C7 4 3 8 3 14c0 4 3.5 7 9 8 5.5-1 9-4 9-8 0-6-4-10-9-12z"
          fill={fillColor}
          clipPath={`url(#clip-${status})`}
        />
      )}
    </svg>
  );
}

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [sortBy, setSortBy] = useState('due_date');
  const [form, setForm] = useState({ title: '', description: '', due_date: '', topic: '' });
  const [editingId, setEditingId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [archivedTasks, setArchivedTasks] = useState([]);

  async function loadTasks() {
    const res = await fetch(`/api/tasks?sort=${sortBy}`);
    const data = await res.json();
    setTasks(data);
  }

  async function loadArchivedTasks() {
    const res = await fetch('/api/tasks/archived');
    const data = await res.json();
    setArchivedTasks(data);
  }

  function toggleArchived() {
    if (!showArchived) loadArchivedTasks();
    setShowArchived(!showArchived);
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
    <div className="page">
      <header className="page-header">
        <h1>Todo</h1>
        <p>Local-first task tracking, one leaf at a time.</p>
      </header>

      <form onSubmit={handleSubmit} className="card form-card">
        <fieldset>
          <legend>{editingId ? 'Edit task' : 'New task'}</legend>

          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="due_date">Due date</label>
              <input
                id="due_date"
                type="date"
                value={form.due_date}
                onChange={e => setForm({ ...form, due_date: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="topic">Topic</label>
              <input
                id="topic"
                value={form.topic}
                onChange={e => setForm({ ...form, topic: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            {editingId ? 'Save changes' : 'Add task'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="btn btn-ghost" style={{ marginLeft: '0.5rem' }}>
              Cancel
            </button>
          )}
        </fieldset>
      </form>

      <div className="toolbar">
        <label htmlFor="sort">Sort by</label>
        <select id="sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="due_date">Due date</option>
          <option value="topic">Topic</option>
          <option value="status">Status</option>
        </select>
        <button onClick={toggleArchived} className="btn btn-ghost btn-small" style={{ marginLeft: 'auto' }}>
          {showArchived ? 'Hide archived' : 'View archived'}
        </button>
      </div>

      <section aria-label="Task list">
        <ul className="task-list">
          {tasks.map(task => (
            <li key={task.id} className={`task-card${task.isOverdue ? ' is-overdue' : ''}`}>
              <LeafIcon status={task.status} />
              <div className="task-body">
                <div className="task-top">
                  <span className="task-title">{task.title}</span>
                  {task.isOverdue && <span className="overdue-tag">Overdue</span>}
                </div>
                {task.description && <p className="task-desc">{task.description}</p>}
                <div className="task-meta">Due {task.due_date} · {task.topic}</div>
                <div className="task-controls">
                  <label htmlFor={`status-${task.id}`} style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    Status
                  </label>
                  <select
                    id={`status-${task.id}`}
                    value={task.status}
                    onChange={e => updateStatus(task.id, e.target.value)}
                  >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In progress</option>
                    <option value="complete">Complete</option>
                  </select>
                  <button onClick={() => startEdit(task)} className="btn btn-ghost btn-small" aria-label={`Edit ${task.title}`}>
                    Edit
                  </button>
                  <button onClick={() => archiveTask(task.id)} className="btn btn-ghost btn-small" aria-label={`Archive ${task.title}`}>
                    Archive
                  </button>
                </div>
              </div>
            </li>
          ))}
          {tasks.length === 0 && <p className="empty-note">No active tasks yet — add one above.</p>}
        </ul>
      </section>

      {showArchived && (
        <section aria-label="Archived tasks" className="archived-section">
          <h2>Archived</h2>
          <ul className="task-list">
            {archivedTasks.map(task => (
              <li key={task.id} className="archived-card">
                <div className="archived-title">{task.title}</div>
                {task.description && <div>{task.description}</div>}
                <div className="archived-meta">
                  Due {task.due_date} · {task.topic} · {task.status} · archived {task.archived_at}
                </div>
              </li>
            ))}
          </ul>
          {archivedTasks.length === 0 && <p className="empty-note">No archived tasks.</p>}
        </section>
      )}
    </div>
  );
}