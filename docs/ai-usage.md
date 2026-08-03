# AI Usage

AI assistance was used throughout this project for planning, code generation, and debugging, primarily via Claude (Sonnet 5). Constraints were stated up front in each session (existing folder structure, Windows/PowerShell environment, Next.js App Router, `better-sqlite3`, Jest/Supertest), and outputs were tested against real behaviour before being accepted — errors were traced back to their actual cause via terminal output rather than accepted on first suggestion.

Full raw transcripts are included in the submission alongside this summary.

## Log

| Date | Tool | Description |
|---|---|---|
| 01-08-2026 | Claude (Sonnet 5) | Structuring how to break up daily tasks across the three days before the deadline |
| 01-08-2026 | Claude (Sonnet 5) | Generating the initial project folder structure |
| 01-08-2026 | Claude (Sonnet 5) | Setting up the Next.js project and fixing the environment (empty `package.json`, `create-next-app` conflicting with existing folders, `nextconfig.js` → `next.config.js`) |
| 01-08-2026 | Claude (Sonnet 5) | Editing/correcting the SQLite schema |
| 01-08-2026 | Claude (Sonnet 5) | Generating code for the initial `createTask`/`listTasks` query layer and `/api/tasks` route |
| 01-08-2026 | GitHub Copilot (default model, inline suggestions) | Inline code suggestions while writing early project files |
| 01-08-2026 | Claude (Sonnet 5) | Debugging (PowerShell `curl` alias failure, ES Module conversion, `SQLITE_ERROR` from an invalid schema) |
| 02-08-2026 | Claude (Sonnet 5) | Generating code for edit, archive, and sorting endpoints, and the derived overdue flag |
| 02-08-2026 | Claude (Sonnet 5) | Debugging environment and filename issues (`routes.js` vs `route.js` typo, missing `getDb` import, Next.js dynamic route conflicts) |
| 02-08-2026 | Claude (Sonnet 5) | **Redirecting AI output** — questioned whether the generated frontend markup was semantic HTML; AI-provided markup was revised to use `<label>`, `<fieldset>`, `<section>`, and `aria-label` attributes |
| 02-08-2026 | Claude (Sonnet 5) | Generating code for viewing archived tasks (endpoint, query function, frontend toggle) |
| 03-08-2026 | Claude (Sonnet 5) | Generating the Jest test suite (task creation, archiving, overdue derivation) |
| 03-08-2026 | Claude (Sonnet 5) | Debugging the test environment (Windows-incompatible Jest binary, empty placeholder test files, missing `dir` variable, SQLite file-lock `EBUSY` error on Windows) |
| 03-08-2026 | Claude (Sonnet 5) | Finalising and editing documentation (`README.md`, `docs/third-party-code.md`, `docs/database-design.md`, `docs/running-it.md`) |
| 03-08-2026 | Claude (Sonnet 5) | **Redirecting AI output** — reviewed drafted documentation and questioned specific claims: removed an unnecessary line in `running-it.md`, and requested verification of a factual claim in `database-design.md` before accepting it |

## Examples of correcting or redirecting AI output

**Schema written in the wrong SQL dialect.** An early version of `db/schema.sql` used MySQL syntax (`AUTO_INCREMENT`, `ENUM`, `DATE`/`TIMESTAMP` types) which is invalid in SQLite and caused a `SQLITE_ERROR` at runtime. This was identified from the actual server stack trace, corrected to valid SQLite syntax (`AUTOINCREMENT`, a `TEXT` column with a `CHECK` constraint in place of `ENUM`), and a missing required field (`topic`) was added at the same time.

**Non-semantic frontend markup.** The first version of the task list/form UI used generic `div`/`ul` elements and placeholder-only inputs with no `<label>` elements. This was flagged directly, and the markup was revised to use proper `<label>`, `<fieldset>`, `<legend>`, `<section>`, and `aria-label` attributes.

