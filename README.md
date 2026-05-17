# Barkyard

A marketplace where dog owners rent private backyards by the hour. Built like Airbnb, but for dogs.

Stack: **Next.js 14 (App Router) · TypeScript · Tailwind · Prisma + SQLite · NextAuth · Leaflet · Stripe (stubbed)**.

## Quickstart

```bash
npm install
cp .env.example .env
npm run dev
```

The `postinstall` script runs `prisma generate`. To seed the database with 12 sample yards across Seattle, Portland, and Austin:

```bash
npm run db:push
npm run seed
```

Then visit <http://localhost:3000>.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Generate Prisma client, push schema, seed, and build Next |
| `npm run start` | Run the production server |
| `npm run seed` | Reset and reseed the database |
| `npm run db:push` | Sync the Prisma schema to SQLite |

## Pages

- `/` — Homepage with category rail and yard grid
- `/yards/[id]` — Listing detail with gallery, map, reviews, and booking card
- `/search` — Split list + Leaflet map view with filters
- `/host` — Six-step multi-page listing wizard
- `/bookings` — Trips: upcoming, past, cancelled
- `/dashboard` — Host dashboard with stats, earnings chart, and listings
- `/signin` — Demo credentials sign-in (Google optional)

## What's real vs. stubbed

**Real**
- Full Prisma + SQLite data layer (users, yards, bookings, reviews) with seed data
- NextAuth (JWT) with a Demo credentials provider that works out of the box
- Live homepage, search, yard detail, bookings, and host wizard backed by the database
- Booking creation with overlap detection and cancellation
- Listing creation that writes to the database and flips the user to `isHost: true`
- Leaflet maps with approximate-location circles for privacy and price-pin markers in search
- Photo carousels, heart save state, photo gallery dialog, and stat dashboard

**Stubbed**
- **Stripe payments** — Set `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` to wire it up. When blank, bookings are confirmed instantly without a charge so the demo flows end-to-end.
- **Google OAuth** — Only enabled if `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set.
- **Photo uploads** — The host wizard picks from a curated Unsplash gallery instead of accepting file uploads.

## Environment variables

See `.env.example`. The only required one for local dev is `DATABASE_URL`, which defaults to `file:./dev.db`.

## Deploying to Vercel

The `build` script seeds a SQLite file at build time. At runtime on Vercel, that file is copied to `/tmp` so mutations (bookings, listings) work within a warm function lifecycle. The seeded read-only data is always available; new bookings persist until the function is recycled.

If you'd rather use a hosted database (Turso, Neon, Supabase), swap the Prisma datasource and remove the `/tmp` copy in `src/lib/prisma.ts`.

## Project layout

```
src/
  app/                 # App Router pages and API routes
  components/          # UI primitives + feature components
  lib/                 # prisma, auth, amenities, utils
prisma/
  schema.prisma        # Data models
  seed.ts              # 12-yard demo seed
```
