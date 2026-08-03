# Running It

## Requirements

- **Node.js v24.14.0** (or later).
- This application is local-first: it is not deployed anywhere. It runs entirely on the machine that starts it, and stores its data in a local SQLite file.

## 1. Install

From a clean clone of the repository, in the project root:

```bash
npm install
```

This installs all runtime and development dependencies listed in `package.json`, including `next`, `react`, `better-sqlite3`, `jest`, and `supertest`.

No manual database setup is required. The SQLite database file (`data/todo.db`) and its schema are created automatically the first time the application runs, using `db/schema.sql`.

## 2. Run

```bash
npm run dev
```

This starts the Next.js development server. Once ready, the terminal will print a local URL:

```
Local: http://localhost:3000
```

Open that URL in a browser to use the application. The interface allows creating, editing, archiving, and viewing tasks, sorting the active list by topic/status/due date, and viewing archived tasks.

To stop the server, press `Ctrl+C` in the terminal.

### Restarting and data persistence

Stopping and restarting the server (`Ctrl+C`, then `npm run dev` again) does not clear any data. All tasks remain in `data/todo.db` between restarts, since the database is a file on disk, not in-memory state.

## 3. Test

```bash
npm test
```

This runs the Jest test suite (`tests/tasks.test.js`), which covers:
- Creating a task with all required fields
- Archiving a task and confirming it is excluded from the active task list
- The overdue rule being correctly derived for a task with a past due date

Tests run against a separate SQLite file (`data/test.db`), which is cleared before each test via `DELETE FROM tasks`. This is entirely separate from the development database (`data/todo.db`) used by `npm run dev`, so running tests never affects or depends on real application data.

## Summary of commands

| Command | Purpose |
|---|---|
| `npm install` | Install all dependencies |
| `npm run dev` | Start the application at `http://localhost:3000` |
| `npm test` | Run the automated test suite |