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

## Deployment

### Vercel (recommended)
```bash
npm install -g vercel
vercel
```
Output directory is configured as `dist` in `vercel.json`.

### Docker
A multi-stage build (Node build → nginx serve) is included.

```bash
# Build and run with Docker
docker build -t sunny-portfolio .
docker run -p 8080:80 sunny-portfolio

# Or with docker-compose
docker compose up --build
```

The site is served at [http://localhost:8080](http://localhost:8080).

### Netlify
```bash
npm run build
# drag & drop the /dist folder to netlify.com/drop
```

### GitHub Pages
```bash
# Add to vite.config.js: base: '/your-repo-name/'
npm run build
# push /dist to gh-pages branch
```
