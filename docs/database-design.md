# Database Design

This application uses a single SQLite database file, stored at `data/todo.db`, created automatically on first run from `db/schema.sql`.

## Tables

### `tasks`

The application has a single table, `tasks`, which holds all task data. There are no other tables and no foreign key relationships.

| Column | Type | Constraints | Purpose |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier for the task. |
| `title` | TEXT | NOT NULL | The task's title. |
| `description` | TEXT | *(nullable)* | Optional free-text description of the task. |
| `due_date` | TEXT | NOT NULL | ISO 8601 date string (e.g. `2026-08-10`) representing when the task is due. |
| `topic` | TEXT | NOT NULL | The topic/category the task belongs to. Used for sorting. |
| `status` | TEXT | NOT NULL, DEFAULT `'todo'`, `CHECK (status IN ('todo', 'in-progress', 'complete'))` | One of three fixed statuses. The `CHECK` constraint enforces this at the database level, preventing any other value from ever being inserted, so statuses cannot become user-customisable. |
| `archived_at` | TEXT | DEFAULT `NULL` | `NULL` while the task is active. Set to a timestamp when the task is archived. Used instead of deletion, so archived tasks remain in the table and remain viewable. |
| `created_at` | TEXT | NOT NULL, DEFAULT `datetime('now')` | Timestamp of when the task was created. |
| `updated_at` | TEXT | NOT NULL, DEFAULT `datetime('now')` | Timestamp of the most recent edit, archive, or status change. Refreshed on every write. |

## Key design decisions

**Archiving, not deleting.** Archiving is implemented as a nullable `archived_at` timestamp on the task row itself, rather than moving or copying the row elsewhere, and rather than a boolean flag. A timestamp additionally records *when* the task was archived, which is used to order the archived-tasks view (most recently archived first). The active-task list query filters with `WHERE archived_at IS NULL`; the archived-task list query filters with `WHERE archived_at IS NOT NULL`. Archived tasks are never deleted.

**Overdue is derived, not stored.** There is no `overdue` column and no `overdue` status value. Whether a task is overdue is computed at read time, in `src/lib/tasks.js`, by comparing `due_date` against the current date and checking that `status` is not `'complete'`. This avoids the flag ever going stale — if a task's due date is edited, or its status changes to `complete`, the derived value is always correct on the next read, with no extra write needed to keep a stored column in sync.

**Status is constrained via `CHECK`, not a separate lookup table.** Since the three statuses (`todo`, `in-progress`, `complete`) are fixed and not user-customisable per the brief, a `CHECK` constraint on a `TEXT` column is sufficient and avoids the overhead of a second table with a foreign key for a fixed, small set of values.

## Schema file

The full schema is defined in `db/schema.sql` and is executed automatically against the SQLite file every time the application starts (via `db/client.js`), using `CREATE TABLE IF NOT EXISTS`, so it is safe to run repeatedly without affecting existing data.