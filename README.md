# Handyman Tech Repair

Bilingual (English / French) website for a walk-in tech repair shop in **Toronto, Ontario**: a service catalog with prices, online repair booking with live tracking, verified customer reviews and a simple admin area.

Next.js 16 (App Router, Cache Components) · Drizzle ORM · Supabase Postgres · shadcn/ui · Vercel · GitHub Actions.

To rebrand, edit the business name, phone, address, hours, time zone and tax rate in [`src/config/site.ts`](src/config/site.ts).

## Canada specifics

- **Languages:** every public page exists in English and Canadian French under `/en/...` and `/fr/...`. `src/proxy.ts` redirects `/` and any unprefixed path using the saved language (`NEXT_LOCALE` cookie, set by the EN/FR switcher in the header), then the browser's `Accept-Language`, then English. Pages declare `hreflang` alternates.
- **Translations:** UI strings live in [`src/i18n/dictionaries/en.ts`](src/i18n/dictionaries/en.ts) and [`fr.ts`](src/i18n/dictionaries/fr.ts). `fr.ts` is typed against `en.ts`, so a missing key fails `pnpm typecheck`. Service and category names, descriptions and turnaround times have `*_fr` columns in the database.
- **Money:** CAD, stored as integer cents (`price_from_cents`, `quote_cents`), shown as `$149.00` / `149,00 $`. Prices are listed before **13% HST** (Ontario). The tracking page shows quote + HST = total.
- **Phone numbers:** North American 10-digit numbers, stored as E.164 (`+14165550123`) and shown as `(416) 555-0123`.
- **Time zone:** booking dates and timelines use `America/Toronto`.
- **Admin** stays English-only at `/admin`. Each booking shows an **EN/FR** badge so staff contact customers in the language they booked in.

## Routes

| Route                     | What it does                                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| `/`                       | Redirects to `/en` or `/fr`                                                                             |
| `/[lang]`                 | Hero carousel, device quick access, popular services, how it works, stats, latest reviews, FAQ          |
| `/[lang]/services`        | Search (both languages, accent-insensitive) and device category chips (`?category=phones&q=ecran`)      |
| `/[lang]/services/[slug]` | Service details, starting price + HST, turnaround, "Book this repair"                                   |
| `/[lang]/book`            | Guest booking form (`?service=<slug>` preselects a service); redirects to `/[lang]/book/success?code=…` |
| `/[lang]/track`           | Booking code + phone → status timeline and quote with HST; review form once the repair is completed     |
| `/[lang]/reviews`         | Rating summary and all published (verified) reviews                                                     |
| `/admin`                  | English, password-protected: bookings by status, booking detail/status/quote, reviews, service prices   |
| `/api/health`             | Database health check                                                                                   |

**Booking flow:** `pending → confirmed → received → diagnosing → repairing → ready → completed`, or `cancelled`. Every admin status change or note is added to `booking_events` and shown on the customer's tracking page.

**Reviews** can only be submitted for a **completed** booking. The customer proves it with booking code + phone, and each booking gets one review. Reviews publish immediately; admins can hide or republish them.

**Caching:** services and reviews are cached with `"use cache"` + `cacheTag` and prerendered at build time. Admin edits and new reviews call `updateTag`, so changes show up immediately. Because of this, `next build` needs a reachable `DATABASE_URL`. Vercel provides it, and CI only builds after migrations have run.

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

Create a token at <https://vercel.com/account/tokens>. Then in _Project → Settings → Environment Variables_, add these separately for **Preview** and **Production**:

| Variable               | Value                                                                      |
| ---------------------- | -------------------------------------------------------------------------- |
| `DATABASE_URL`         | Transaction pooler URL (preview-db for Preview, prod for Production)       |
| `ADMIN_PASSWORD`       | Password for `/admin` (8+ characters; use a different one per environment) |
| `ADMIN_SESSION_SECRET` | 32+ random characters: `openssl rand -base64 32`                           |

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

In the **`preview`** environment, also add the **variable** (not a secret) `SEED_DEMO=true`, so preview-db gets demo bookings and reviews. Leave it unset on `production`, which then gets only the service catalog.

Recommended: add _required reviewers_ to `production` and protect the `main` branch.

## Local development

```bash
cp .env.example .env   # fill in DB URLs, admin password and session secret
pnpm install
pnpm db:migrate && pnpm db:seed
pnpm dev               # http://localhost:3000 (admin at /admin)
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

| Script               | Purpose                                                      |
| -------------------- | ------------------------------------------------------------ |
| `pnpm db:generate`   | Generate SQL from schema changes                             |
| `pnpm db:migrate`    | Apply pending migrations (uses `DIRECT_URL`)                 |
| `pnpm db:seed`       | Catalog (always) + demo bookings/reviews if `SEED_DEMO=true` |
| `pnpm db:rollback`   | Roll back last N (`--steps N`, default 1)                    |
| `pnpm db:check-down` | Ensure every migration has a down file                       |
| `pnpm db:studio`     | Drizzle Studio                                               |

## Caveats

- **Shared preview-db.** All PRs migrate the same database. Runs are serialized (`concurrency: preview-db`), but two open PRs with conflicting migrations will collide. Closing a PR does not revert its migrations, so use the **Rollback** workflow (environment `preview`). Supabase Branching can replace this later.
- Write migrations **backward-compatible** (expand → migrate → contract). The DB is migrated before new code goes live, and a rollback leaves the previous deploy running.
- Down migrations that drop columns/tables destroy data. Review them like production code.
