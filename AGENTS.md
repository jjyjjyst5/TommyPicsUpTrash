<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# TommyTrash — project orientation

Awareness site for **Tom Ross (@TommyPicsUpTrash)**, who kayaks litter out of Pittsburgh's
**Ohio River** and Clearwater's **Stevenson Creek**. The public homepage tells his story and
shows live cleanup counts; an admin panel lets him manage everything. See `README.md` for
setup/run/deploy commands; this file is the architecture map + the non-obvious decisions.

## Stack
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Drizzle ORM over Postgres ·
framer-motion · lucide-react. Deployed on Vercel (Neon Postgres + Vercel Blob). Commands:
`npm run dev`, `npm run build`, `npm test` (parser tests), `npm run db:seed`.

## Where things live
- `app/page.tsx` — public homepage; composes section components in `components/`. Order:
  Hero → Story ("My Trash Story") → ImpactDashboard (per-waterway) → Quotes → CrazyFinds
  ("Wildest Finds") → Gallery → Press → GetInvolved.
- `app/admin/(panel)/*` — authed admin pages. The `(panel)` route group shares the sidebar
  layout; `app/admin/login` is intentionally OUTSIDE it. Pages call server actions in
  `app/actions/*`.
- `db/schema.ts` — Drizzle tables. `db/index.ts` — connection + an **idempotent schema
  bootstrap** (CREATE TABLE IF NOT EXISTS) that runs on first connect. `db/seed.ts` — seed data.
- `lib/` — `stats.ts` (totals), `data.ts` (fetchers), `parseTweet.ts` (+test), `media.ts`
  (embed detection), `imageCompress.ts` (browser image downscale), `auth.ts` (edge-safe
  session/JWT), `adminAuth.ts` (DB-backed credential check), `blob.ts` (uploads),
  `content.ts` (static editorial copy + defaults).

## Data model — read before touching counts
- Counts are **summed from `cleanups` rows** (`lib/stats.ts`), never stored as one total.
  Historical figures are themselves rows with `source: 'baseline'`. New hauls (manual or parsed
  from a pasted tweet) are extra rows, so totals only grow.
- **Pounds are estimated** as `bags × waterBody.lbsPerBag` (default 20) unless a haul has an
  explicit `pounds`.
- Editing a body's "total bags/bottles" in admin **reconciles the baseline row** so the SUM
  equals the entered value (`app/actions/waterBodies.ts`) — don't add a separate totals column.
- Tables: `water_bodies`, `cleanups`, `gallery_images`, `press_items` (the KDKA interview is a
  `type:'radio'` row; audio is a trimmed MP3 on Vercel Blob), `crazy_finds`, `site_content`
  (editable copy KV, e.g. the story; falls back to `lib/content.ts` defaults), `admin_account`.

## Auth
- Single admin. `lib/auth.ts` is **edge-safe** (jose only, no DB/bcrypt) so `proxy.ts` can guard
  `/admin/*`. Credential verification is DB-backed in `lib/adminAuth.ts` (bcrypt), with env
  fallback (`ADMIN_USERNAME`/`ADMIN_PASSWORD_HASH`/`ADMIN_PASSWORD`); the password is changeable
  in `Admin → Account`. `AUTH_SECRET` signs the JWT cookie.
- Request gating lives in **`proxy.ts`** (Next 16 renamed `middleware.ts` → `proxy.ts`).

## Conventions & gotchas
- **Local = PGlite** (in-process, `./.pglite`), **prod = Neon** — auto-selected by
  `DATABASE_URL` presence. Same Postgres dialect, so deploy is just a driver swap. **Never keep
  a `vercel env pull`'d `.env.local` with `DATABASE_URL`** locally, or dev writes hit prod.
- New tables need a `CREATE TABLE IF NOT EXISTS` in `db/index.ts` (no migration step runs); prod
  picks it up on the next deploy/cold start.
- Public pages use `export const dynamic = "force-dynamic"` and read fresh, so **content/data
  edits show instantly with no redeploy**; only code/component changes need a deploy.
- **Image uploads auto-compress in the browser** (`lib/imageCompress.ts`) via the useActionState
  action wrapper before sending — keeps phone photos under the Server Action body limit
  (`serverActions.bodySizeLimit: '4.5mb'` in `next.config.ts`). Videos go in by URL and embed via
  `lib/media.ts`.
- Server actions check `getSession()` and `revalidatePath('/')` after writes.
- Avoid nested `<form>`s — use a button `formAction={action.bind(null, id)}` for delete-in-edit.
- `Reveal` uses framer-motion `whileInView`; static full-page screenshots look blank until you
  scroll each section into view first.
- Run commands from the project root (the Bash working dir persists between calls).

## Making changes & deploying
`npm run build` to verify types → commit (end messages with the Co-Authored-By trailer) → push →
`vercel deploy --prod --yes`. Verify with `curl` on the prod URL and/or Playwright screenshots
(Playwright + chromium are installed; mint an admin cookie with `createSessionToken` from
`lib/auth.ts` to reach `/admin` pages). Always clean up any test rows you insert.
