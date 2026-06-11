# Tommy Picks Up Trash

A modern awareness site for **Tom Ross (@TommyPicsUpTrash)**, who cleans litter from
Pittsburgh's **Ohio River** and Clearwater's **Stevenson Creek** — one kayak, one bag at a
time. Features live, animated trash-bag and pounds-of-trash counters (grand total + per
water body), his story, quotes, a photo gallery, press coverage, and an admin panel.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript** · **Tailwind v4**
- **Drizzle ORM** over Postgres — **PGlite** (in-process) locally, **Neon** in production
- **framer-motion** animated counters · **lucide-react** icons
- Lightweight single-admin auth (bcrypt + JWT cookie), guarded by `proxy.ts`
- Image uploads via local `/public/uploads` (dev) or **Vercel Blob** (prod)

## Getting started

```bash
npm install
npm run db:seed     # creates ./.pglite and seeds researched starting numbers
npm run dev         # http://localhost:3000
```

Open the site at `/`. The **admin panel** is at `/admin`.

**Default dev login:** username `tommy`, password `tommytrash`
(override via `ADMIN_USERNAME` / `ADMIN_PASSWORD` / `ADMIN_PASSWORD_HASH` — see `.env.example`).

## How the counters work

Totals are **summed from logged hauls** (`cleanups` rows), so they only ever grow as Tommy
adds cleanups. Pounds are estimated at **~20 lbs/bag** (grounded in his own field numbers)
unless a weighed amount is recorded. Edit the estimate per water body under **Admin →
Water bodies**.

### Updating the count

- **Admin → Log a haul → Manual entry** — type bags / bottles / pounds for a cleanup.
- **Admin → Log a haul → Paste a tweet** — paste one of his tweets; the parser
  (`lib/parseTweet.ts`) pulls the numbers, detects the water body, reconciles "Nth bag"
  milestones against the running total, and shows an editable preview before you save.

## Admin features

- **Dashboard** — live totals + recent hauls (with delete)
- **Log a haul** — manual entry + paste-a-tweet parser
- **Gallery** — upload Tommy's real photos (placeholders show until then)
- **Press & interview** — manage coverage; paste the **KDKA radio** audio embed + transcript
- **Water bodies** — edit blurb, pounds-per-bag estimate, kayak trips

## Tests

```bash
npm test            # tweet-parser unit tests
```

## Deploying to Vercel

1. Push to a Git repo and import into Vercel.
2. Add a **Neon Postgres** integration (Vercel Marketplace) → it sets `DATABASE_URL`.
3. Add **Vercel Blob** → it sets `BLOB_READ_WRITE_TOKEN`.
4. Set `AUTH_SECRET`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD_HASH`.
5. Deploy. The schema bootstraps automatically on first DB access; run the seed once if you
   want the starting numbers (`DATABASE_URL=... npm run db:seed`).
