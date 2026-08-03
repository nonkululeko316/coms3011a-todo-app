# Third-Party Code

The following third-party packages are used in this project.

## Runtime dependencies

| Package | Why it was chosen |
|---|---|
| **next** | Framework for the application, providing the App Router used for both the frontend pages and the `/api/tasks` backend routes in a single project, avoiding the need for a separate server. |
| **react** / **react-dom** | Required peer dependencies of Next.js for building the UI; used for the task list, forms, and interactive state (editing, sorting, archived view). |
| **better-sqlite3** | SQLite driver used for persistence. Chosen over the async `sqlite3` package because this is a single-user, local-first application with no concurrent access to manage — a synchronous API removes unnecessary callback/promise complexity for what are simple, fast local queries. |

## Development dependencies

| Package | Why it was chosen |
|---|---|
| **jest** | Test runner used to write and run the test suite (`tests/tasks.test.js`), covering task creation, archiving, and the overdue derivation rule. |
| **supertest** | Installed for exercising HTTP endpoints directly in tests if needed; complements Jest by allowing requests to be made against the API layer. |

## Note on native modules

`better-sqlite3` compiles a native binding during installation. No manual build steps are required beyond `npm install`, but if the binding ever fails to load (e.g. after a Node version change), run `npm rebuild better-sqlite3`.