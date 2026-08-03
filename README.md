# COMS3011A Todo App

A local-first todo/task management application built with Next.js and SQLite. There are no user accounts — the application serves a single user on the machine it runs on, and does not connect to any external server or database.

## Requirements

- Node.js v24.14.0 (or later)

## Quick start

From a clean clone of this repository:

```bash
npm install
npm run dev
```

Then open **http://localhost:3000** in a browser.

No database setup is needed — the SQLite database (`data/todo.db`) and its schema are created automatically the first time the application runs.

## Running tests

```bash
npm test
```

Runs the Jest test suite against a separate, throwaway SQLite database (`data/test.db`), fully independent of your real task data.

## Features

- Create, edit, and archive tasks (title, description, due date, topic)
- Archived tasks are never deleted and remain viewable
- Sort the active task list by topic, status, or due date
- Overdue tasks are flagged automatically, derived from the due date and status at read time — not stored
- Data persists across restarts

## Documentation

Further detail is in the `docs/` folder:

- [`docs/third-party-code.md`](docs/third-party-code.md) — dependencies used and why
- [`docs/database-design.md`](docs/database-design.md) — schema and design decisions
- [`docs/running-it.md`](docs/running-it.md) — full install, run, and test instructionss