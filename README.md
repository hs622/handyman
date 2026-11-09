# Handyman Tech Repair (static site)

Bilingual (English / French) website for a walk-in tech repair shop in **Toronto, Ontario**: service catalog with upfront prices, customer reviews, FAQ and call/text-to-book.

This branch is the **static version**: no database, no booking backend, no admin. All content lives in TypeScript files and every page is prerendered at build time.

Next.js 16 (App Router, Cache Components) · shadcn/ui · Tailwind CSS v4 · Vercel · GitHub Actions.

## Editing content

| What                                                                      | Where                                                                                                |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Business name, phone, address, hours, tax rate, stats                     | [`src/config/site.ts`](src/config/site.ts)                                                           |
| Services, categories, prices (CAD cents before HST), turnaround — EN + FR | [`src/data/catalog.ts`](src/data/catalog.ts)                                                         |
| Customer reviews (empty until you add real ones)                          | [`src/data/reviews.ts`](src/data/reviews.ts)                                                         |
| UI text                                                                   | [`src/i18n/dictionaries/en.ts`](src/i18n/dictionaries/en.ts), [`fr.ts`](src/i18n/dictionaries/fr.ts) |
| Logo / favicon                                                            | [`src/app/icon.svg`](src/app/icon.svg), then `pnpm icons`                                            |

- Set `active: false` on a service to hide it.
- The home-page review section stays hidden while `reviews.ts` is empty. Add only real reviews, with the customer's permission.
- `fr.ts` is typed against `en.ts`, so a missing French string fails `pnpm typecheck`.
- Booking happens by phone or text: every "Call to book" button uses `site.phoneHref` and every "Text us" button uses `site.smsHref`.

## Canada specifics

- **Languages:** pages live under `/en/...` and `/fr/...`. `src/proxy.ts` redirects `/` and unprefixed paths using the saved choice (`NEXT_LOCALE` cookie, set by the EN/FR switcher), then the browser's `Accept-Language`, then English. Pages declare `hreflang` alternates.
- **Money:** CAD, shown as `$149.00` / `149,00 $`, listed before **13% HST** (TVH in French).
- **Phone:** North American format, `(416) 555-0100` (placeholder in the 555-01xx fictional range).

## Routes

| Route                     | What it does                                                                                                    |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `/`                       | Redirects to `/en` or `/fr`                                                                                     |
| `/[lang]`                 | Hero carousel, device quick access, popular services, how it works, stats, reviews (if any), FAQ, call/text CTA |
| `/[lang]/services`        | Search (both languages, accent-insensitive) and device category chips (`?category=phones&q=ecran`)              |
| `/[lang]/services/[slug]` | Service details, starting price + HST, turnaround, Call / Text buttons                                          |
| `/[lang]/reviews`         | Rating summary and reviews from `src/data/reviews.ts`                                                           |

## Pipeline

| Trigger           | Workflow                           | Vercel target                                   |
| ----------------- | ---------------------------------- | ----------------------------------------------- |
| PR → `main`       | `preview.yml` → `_pipeline.yml`    | Preview (URL posted on the PR)                  |
| Push to `main`    | `production.yml` → `_pipeline.yml` | Production                                      |
| Manual (dispatch) | `rollback.yml`                     | Re-points production to the previous deployment |

`_pipeline.yml` runs **1. Lint & typecheck** (ESLint, Prettier, `next typegen` + `tsc`) and then **2. Deploy** (`vercel pull` → `vercel build` → `vercel deploy --prebuilt`, with `--prod` on `main`). Vercel's own Git auto-deploys are turned off in `vercel.ts`, so GitHub Actions is the only deploy path.

### One-time setup

1. `vercel link` creates `.vercel/project.json` with the `orgId` and `projectId`. Create a token at <https://vercel.com/account/tokens>.
2. In GitHub _Settings → Secrets and variables → Actions_, add the repository secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`.
3. In GitHub _Settings → Environments_, create `preview` and `production`. They need no secrets; adding required reviewers on `production` is recommended.

No environment variables are needed: the site has no database or API keys.

## Local development

```bash
pnpm install
pnpm dev               # http://localhost:3000 → redirects to /en or /fr
```

| Script                               | Purpose                                                             |
| ------------------------------------ | ------------------------------------------------------------------- |
| `pnpm dev` / `build` / `start`       | Next.js                                                             |
| `pnpm lint` / `typecheck` / `format` | Code quality (same checks as CI)                                    |
| `pnpm icons`                         | Regenerate `favicon.ico` + `apple-icon.png` from `src/app/icon.svg` |
