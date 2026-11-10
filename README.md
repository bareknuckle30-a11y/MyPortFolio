# Webhead Solutions: business website

React (Vite) front end, Node + Express API, Supabase (Postgres) database, Brevo email.
Dark graffiti-on-concrete design with an interactive spray-paint hero and animated service cards.

```
webhead/
├─ client/      React + Vite site (public pages and /admin)
├─ server/      Express API (contact, newsletter, projects, health)
└─ supabase/    SQL migration and seed data
```

## What was and was not tested

Built and checked without network access, so `npm install` was not possible. Checked:
every file parses (esbuild for JSX, `node --check` for server), all relative imports resolve, the server's
zod schemas accept and reject the right input, and every page renders to HTML and looks right in desktop
and phone widths with the router and Supabase stubbed. **Not run yet:** the Express server against real
Supabase and Brevo, `vite build`, the admin login, and the prerender script. Follow the steps below and
expect to fix small things on first run.

## 1. Install

Requires Node 18.17 or newer.

```bash
npm install                 # root: installs `concurrently`
npm run install:all         # installs server/ and client/
```

## 2. Supabase

1. Create a project at supabase.com.
2. SQL editor: run `supabase/migrations/001_init.sql`, then `supabase/seed.sql` (3 clearly labeled placeholder projects).
3. Authentication > Users > Add user: create your admin login (email + password).
4. SQL editor: `insert into public.admins (email) values ('you@yourdomain.com');` (same email as step 3).
5. Project Settings > API: copy the project URL, the **anon** key (for the client) and the **service_role** key (for the server only).

Security model: Row Level Security is on for every table. Visitors can only read published projects. Enquiries and
newsletter sign-ups are written by the Express API with the service-role key. Signed-in admins can read enquiries and
change their status. The service-role key must never be in client code or committed to git.

## 3. Brevo

1. Create an account, then SMTP & API > API keys > generate a key.
2. Senders & IP > add and verify your sender address, then **authenticate your domain** (SPF, DKIM, DMARC). Without
   this, mail to the visitor often lands in spam.
3. Contacts > Lists: create "Website leads" and "Newsletter" and note each list's numeric ID.

## 4. Configure

```bash
cp server/.env.example server/.env     # fill in Supabase, Brevo, OWNER_EMAIL, list IDs
cp client/.env.example client/.env     # fill in site URL, contact email, Supabase URL + ANON key
```

With `BREVO_API_KEY` empty the server still runs: enquiries are saved and a warning is logged, no email is sent.

## 5. Run

```bash
npm run dev      # API on :4000, site on :5173 (Vite proxies /api to the API)
```

Health check: `http://localhost:4000/api/health`. Admin: `http://localhost:5173/admin`.

## API

| Method | Path | What it does |
| --- | --- | --- |
| POST | `/api/contact` | Validates (zod, honeypot, 5 per 10 min per IP), saves the lead, emails you and the visitor, adds the visitor to a Brevo list. If email fails the lead is still saved. |
| POST | `/api/newsletter` | Saves the address, sends a confirmation email (double opt-in). Same reply whether or not the address already exists. |
| GET | `/api/newsletter/confirm?token=` | Confirms the subscription, adds to the Brevo list, redirects to the site. |
| GET | `/api/projects`, `/api/projects/:slug` | Published case studies, read-only. |
| GET | `/api/health` | Uptime check. |

Errors are always `{ "error": { "code", "message", "fields?" } }`. Stack traces are never returned in production.

## Build and prerender

```bash
npm run build                         # client/dist
cd client && npm i -D playwright && npx playwright install chromium
npm run build:prerender               # also writes static HTML for each public route
```

The site is client-rendered, so crawlers and link previews only see content that JavaScript produces. Prerendering writes
real HTML and meta tags for each public page. Set `PRERENDER_API_URL=https://your-api` to bake your real projects into
`/work`. `/work/:slug` pages are not prerendered; add them to `ROUTES` in `client/scripts/prerender.mjs` if you want them.

## Deploy

**Frontend (Vercel or Netlify):** root `client`, build `npm run build` (or `build:prerender`), output `dist`.
Set `VITE_API_URL` (your API's public URL), `VITE_SITE_URL`, `VITE_CONTACT_EMAIL`, `VITE_BOOKING_URL`,
`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. `vercel.json` and `public/_redirects` handle client-side routing.

**Backend (Render or Railway):** root `server`, start `npm start`. Set every variable from `server/.env.example`.
`CLIENT_URL` must be your exact site origin (comma-separate `https://yourdomain.com,https://www.yourdomain.com`).
`SERVER_URL` must be the API's public URL, because newsletter confirmation links point at it.

## Pre-launch checklist

- [ ] Replace every `[PLACEHOLDER]` (search the project): owner name and location, prices, timelines, FAQ answers,
      About story, Privacy and Terms (have them reviewed for your jurisdiction).
- [ ] `client/src/data/site.js`: contact email and booking link (or set the env vars).
- [ ] Replace the three seeded placeholder projects with real case studies, or delete them.
- [ ] `client/public/sitemap.xml` and `robots.txt`: replace `yourdomain.com`.
- [ ] Verify the Brevo sender and authenticate the domain (SPF, DKIM, DMARC).
- [ ] Add your analytics snippet in `client/index.html` (marked), and mention it in the privacy policy.
- [ ] Send a test enquiry and a test newsletter sign-up end to end; confirm both emails arrive.
- [ ] Sign in at `/admin`, change a status, export the CSV.
- [ ] Run Lighthouse on the live site (mobile) and check on a real phone: tap splat, sideways spray, vertical scroll.
- [ ] Never commit `.env` files. Rotate any key that was ever shared.

## Notes

- Budget ranges are in `client/src/data/site.js` and `server/src/schemas.js` and must match.
- Animations are 6-second CSS loops that start mid-cycle and are static under `prefers-reduced-motion`.
- The hero logo video is 3 seconds, loops, and is muted. Under reduced motion the poster image shows instead.
- CSV export prefixes cells that start with `= + - @` with an apostrophe so spreadsheets do not run visitor text as formulas.
