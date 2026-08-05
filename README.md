# Sunny Charkhwal — DevOps Portfolio

A production-grade personal portfolio built with **React 18 + Vite 5**, featuring an
animated DevOps aesthetic, 12 real-world project case studies, and a fully
interactive particle background.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 5 | Dev server & bundler |
| Redux Toolkit + React-Redux | App-level UI state (active section, project filter, modal) |
| MUI (Material UI) | Dialog, Button, Fab, IconButton & transitions |
| Emotion | Styling engine for MUI |
| react-icons | Tech/brand iconography |
| CSS Variables | Design tokens & theming (`src/index.css`) |
| IntersectionObserver | Scroll-spy & scroll-reveal animations |

---

## Project Structure

```
sunny-portfolio/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Nav.jsx              # Fixed navbar + mobile drawer
│   │   ├── Hero.jsx             # Hero with typewriter role + orbital DevOps visual
│   │   ├── Skills.jsx           # Tech stack grid (8 categories)
│   │   ├── Projects.jsx         # Filterable project grid + MUI detail modal
│   │   ├── Experience.jsx       # Work history + achievements
│   │   ├── Contact.jsx          # Contact cards & CTAs
│   │   ├── Footer.jsx           # Footer with animated terminal line
│   │   ├── BackToTop.jsx        # Floating back-to-top FAB
│   │   ├── DevOpsBackground.jsx # Interactive particle/badge background canvas
│   │   └── SectionHeader.jsx    # Shared section heading
│   ├── data/
│   │   └── index.js             # All portfolio content (edit here)
│   ├── hooks/
│   │   ├── useFadeIn.js         # Scroll-reveal hook
│   │   ├── useActiveSection.js  # Active nav link tracker (scroll-spy)
│   │   └── useScrolled.js       # Navbar scroll state
│   ├── store/
│   │   ├── store.js             # Redux store configuration
│   │   └── uiSlice.js           # UI state slice
│   ├── utils/
│   │   └── scrollTo.js          # Smooth scroll helper
│   ├── App.jsx
│   ├── theme.js                 # MUI theme aligned with CSS tokens
│   ├── index.css                # Global styles & CSS variables
│   └── main.jsx
├── index.html
├── vite.config.js
├── vercel.json
├── Dockerfile
├── docker-compose.yaml
├── package.json
└── .gitignore
```

---

## Getting Started

### Prerequisites
- Node.js **v18+**
- npm **v9+**

### Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build      # outputs to /dist
npm run preview    # preview the production build locally
```

---

## Customisation

All portfolio content lives in **`src/data/index.js`** — edit that single file to update:

- `NAV_LINKS` — sections shown in the navbar
- `SKILLS` — tech stack categories and tags
- `PROJECTS` — the 12 project case studies (objective, steps, AWS services, outcomes)
- `EXPERIENCE` — job title, company, responsibilities
- `CONTACT` — email, LinkedIn, phone, portfolio URL

Global colours and fonts are CSS variables in **`src/index.css`** under `:root`, mirrored
into the MUI theme in **`src/theme.js`**.

---

## Full stack: frontend + backend

The portfolio now has a private admin dashboard (`/login`, `/dashboard`) backed by a
separate Express + MongoDB API in `server/` — see `server/README`-equivalent notes below
and the docs in `server/.env.example`. Production topology: **Vercel** (frontend, static)
→ **Render** (backend, Dockerized) → **MongoDB Atlas** (data) → **Brevo** (reset emails).

### Local: both services together

**One command, one origin — this is the canonical way to run it:**
```bash
cp .env.example .env               # leave VITE_API_URL unset, see comment in the file
cp server/.env.example server/.env # fill in MONGODB_URI, JWT_SECRET, BREVO_API_KEY, ...
npm run dev
```
This runs frontend (`:5173`) and backend (`:5001`) together in one terminal via
`concurrently`, labeled and color-coded per line. (Backend defaults to `5001`, not the
more obvious `5000` — macOS's AirPlay Receiver squats on `5000` by default, which
otherwise fails with `EADDRINUSE` the first time you run this on a Mac.)

The browser only ever talks to `:5173` — `vite.config.js`'s dev-server `proxy` config
transparently forwards anything under `/api` to the backend server-side. That means no
CORS, and no `VITE_API_URL` to keep in sync with whichever port the backend happens to
be on; `src/api/client.js` just uses relative paths when `VITE_API_URL` is unset. If
you change the backend's `PORT` in `server/.env`, update the proxy `target` in
`vite.config.js` to match — that's the one place they still need to agree.

Run only one side with `npm run dev:frontend` or `npm run dev:backend` if you
specifically need that — but `npm run dev` is the default, and the two should not be
run alongside a separate Docker Compose stack at the same time (see below for why).

<details>
<summary>Docker Compose — separate, optional, prod-parity check only</summary>

`docker compose up --build` is a *different, standalone* way to run the same app,
used to sanity-check the actual Docker images before a deploy — not a second dev
server to run next to `npm run dev`. Unlike the native path above, it does **not** use
the Vite dev proxy (there's no Vite dev server in the built image — nginx serves static
files instead), so it needs the old-style absolute URL: it maps the API container's
internal `5001` to **host port `5050`** (see `docker-compose.yaml`), so `.env` needs
`VITE_API_URL=http://localhost:5050` specifically while using this path. Running both
modes at once means two different builds disagreeing about which port is correct,
which is exactly what caused an earlier CSP-block bug here. Stick to one mode at a
time; stop the other before switching (`docker compose down`, or kill the
`npm run dev` process).

```bash
# .env: VITE_API_URL=http://localhost:5050 while using this path (native mode leaves it unset)
docker compose up --build
```
Frontend at [http://localhost:8080](http://localhost:8080), API at
[http://localhost:5050](http://localhost:5050). Vite bakes `VITE_API_URL` into the
bundle at *build* time — changing it needs `--build` again, not just a restart.
</details>

### Backend → Render

1. Push this repo to GitHub (if not already).
2. Render dashboard → **New → Blueprint** → connect the repo. Render reads `render.yaml`
   at the repo root and provisions the API service from `server/Dockerfile` automatically.
3. Fill in the prompted env vars (`MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`,
   `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`, `FRONTEND_URL`) — see the
   table in `server/.env.example` for where each value comes from.
4. Once deployed, note the Render URL (`https://<name>.onrender.com`) — the frontend's
   CSP and `VITE_API_URL` both need it (see next section).

Free tier sleeps after 15 minutes idle; the first request after that takes ~30–50s to
wake it — expected, not a bug.

### Frontend → Vercel

```bash
npm install -g vercel
vercel
```
Output directory is `dist` (set in `vercel.json`). Two things need the **real** Render
URL once you have it, both currently deferred because that URL doesn't exist until the
step above is done:

1. Vercel dashboard → Project → Settings → Environment Variables → add `VITE_API_URL`
   = your Render URL (no trailing slash). Redeploy after adding it — Vite bakes env vars
   in at build time, so it won't take effect until the next build.
2. `vercel.json`'s CSP `connect-src` is currently `'self'` only, which will block every
   fetch to the Render API once deployed. Update it to
   `connect-src 'self' https://<your-render-app>.onrender.com` and redeploy.

Also update `CORS_ORIGIN`/`FRONTEND_URL` on Render (above) to your real Vercel domain
once you know it — the two platforms' URLs are circular dependencies of each other, so
expect one redeploy on each side after the first round.
