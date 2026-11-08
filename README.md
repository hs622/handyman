# Handyman

Next.js 16 (App Router) · Drizzle ORM · Supabase Postgres · Vercel · GitHub Actions.

## Pipeline

| Trigger           | Workflow                           | Database            | Vercel target                |
| ----------------- | ---------------------------------- | ------------------- | ---------------------------- |
| PR → `main`       | `preview.yml` → `_pipeline.yml`    | Supabase preview-db | Preview                      |
| Push to `main`    | `production.yml` → `_pipeline.yml` | Supabase production | Production                   |
| Manual (dispatch) | `rollback.yml`                     | either              | optional app rollback (prod) |

Each run of `_pipeline.yml`:

1. **Lint**: ESLint, Prettier check, `tsc`, and a check that every migration has a down file.
2. **Migrate & seed**: `pnpm db:migrate` records how many migrations it applied, then `pnpm db:seed` (idempotent) runs.
3. **Deploy**: `vercel pull` → `vercel build` → `vercel deploy --prebuilt` (`--prod` on main). On PRs the preview URL is posted as a comment.
4. **Rollback (automatic)**: if seed or deploy fails _and_ this run applied migrations, exactly those migrations are rolled back.

Vercel's own Git auto-deploys are disabled in `vercel.ts`, so the schema is always migrated before code ships.

## One-time setup

### 1. Supabase

Create two projects: **preview-db** and a production project (e.g. `handyman-prod`). For each, copy from _Connect → Connection string_:

- `DATABASE_URL`: **Transaction pooler** (port 6543), used by the app at runtime.
- `DIRECT_URL`: **Session pooler** or direct connection (port 5432), used for migrations/seed/rollback.

### 2. Vercel

```bash
vercel link          # creates .vercel/project.json → orgId + projectId
```

Create a token at <https://vercel.com/account/tokens>. Then in _Project → Settings → Environment Variables_ add:

- `DATABASE_URL` (**Preview**): preview-db transaction pooler URL
- `DATABASE_URL` (**Production**): production transaction pooler URL

### 3. GitHub

_Settings → Secrets and variables → Actions → Repository secrets_:

| Secret              | Value                                   |
| ------------------- | --------------------------------------- |
| `VERCEL_TOKEN`      | Vercel access token                     |
| `VERCEL_ORG_ID`     | `orgId` from `.vercel/project.json`     |
| `VERCEL_PROJECT_ID` | `projectId` from `.vercel/project.json` |

_Settings → Environments_: create **`preview`** and **`production`**, each with secrets:

| Secret         | preview               | production      |
| -------------- | --------------------- | --------------- |
| `DIRECT_URL`   | preview-db, port 5432 | prod, port 5432 |
| `DATABASE_URL` | preview-db, port 6543 | prod, port 6543 |

Recommended: add _required reviewers_ to `production` and protect the `main` branch.

## Local development

```bash
cp .env.example .env   # fill in preview-db (or a local Postgres) URLs
pnpm install
pnpm db:migrate && pnpm db:seed
pnpm dev               # http://localhost:3000/api/health
```

## Database workflow

```bash
# 1. Edit src/db/schema.ts
pnpm db:generate --name add_bookings     # → drizzle/0001_add_bookings.sql
# 2. Write the inverse by hand:
#    drizzle/down/0001_add_bookings.down.sql
pnpm db:check-down                        # CI fails without it
pnpm db:migrate
pnpm db:rollback --steps 1                # test the down migration locally
```

Rollback runs the down files of the last _N_ applied migrations (newest first) in one transaction and removes their rows from `drizzle.__drizzle_migrations`.

| Script               | Purpose                                      |
| -------------------- | -------------------------------------------- |
| `pnpm db:generate`   | Generate SQL from schema changes             |
| `pnpm db:migrate`    | Apply pending migrations (uses `DIRECT_URL`) |
| `pnpm db:seed`       | Idempotent seed data                         |
| `pnpm db:rollback`   | Roll back last N (`--steps N`, default 1)    |
| `pnpm db:check-down` | Ensure every migration has a down file       |
| `pnpm db:studio`     | Drizzle Studio                               |

## Caveats

- **Shared preview-db.** All PRs migrate the same database. Runs are serialized (`concurrency: preview-db`), but two open PRs with conflicting migrations will collide. Closing a PR does not revert its migrations, so use the **Rollback** workflow (environment `preview`). Supabase Branching can replace this later.
- Write migrations **backward-compatible** (expand → migrate → contract). The DB is migrated before new code goes live, and a rollback leaves the previous deploy running.
- Down migrations that drop columns/tables destroy data. Review them like production code.
