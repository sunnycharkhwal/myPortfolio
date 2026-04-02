# Portfolio Backup & Context

**Owner:** Sunny Charkhwal — DevOps Engineer, New Delhi  
**Last Updated:** April 2, 2026 (Next.js Migration Complete)

---

## ⚠️ BACKUP RULES (MANDATORY)
1. **On new session:** Read this file FIRST before any work
2. **After every task:** Update this file immediately
3. **Single file only:** All backups go here — no separate files
4. **No folder accumulation:** If folders needed, use ONE; delete old backups

---

## 🚀 TWO VERSIONS NOW EXIST

### Original (React + Vite)
**Location:** `/Users/hackinghunter/Desktop/React Js/myPortfolio`
- React 18.3.1 + Vite 5.4.21
- `npm run dev` (port 5173)
- `npm run build` → `dist/`

### Next.js Version (NEW)
**Location:** `/Users/hackinghunter/Desktop/React Js/portfolio-nextjs`
- Next.js 16.2.2 + React 19
- App Router with Server Components
- Static export (`output: 'export'`)
- `npm run dev` (port 3000)
- `npm run build` → `out/`

---

## Next.js Migration Details
| Aspect | Change |
|--------|--------|
| **SEO** | Full metadata in `app/layout.js` (title, description, Open Graph, Twitter) |
| **Routing** | App Router with `app/page.js` as home |
| **Components** | All use `'use client'` directive (canvas, animations) |
| **Static Export** | `next.config.js` with `output: 'export'` |
| **Imports** | Use `@/` alias (e.g., `@/components/Nav.jsx`) |

---

## Tech Stack (Next.js)
- Next.js 16.2.2 + React 19.2.4
- No Tailwind (uses CSS Variables)
- All client components (interactive features)
- IntersectionObserver for scroll animations

## Commands (Next.js)
```bash
npm run dev      # Dev server (port 3000)
npm run build    # Production build to out/
npm run start    # Serve production build
```

## Current Theme: Midnight Aurora (Dark)
| Variable | Value | Usage |
|----------|-------|-------|
| `--bg` | #0a0a0f | Main background |
| `--accent` | #00d4ff | Primary (cyan) |
| `--accent-purple` | #a855f7 | Secondary |
| `--accent-pink` | #ff6b6b | Tertiary |
| `--accent-green` | #10b981 | Success |

## Key Components
- `DevOpsBackground.jsx` — Canvas particle system with 51 DevOps icons + 40 floating text badges
- `Projects.jsx` — 13 expandable project cards with category filters
- `Contact.jsx` — 3 creative cards (Email/LinkedIn/Phone) with animations
- `Terminal.jsx` — Animated terminal with kubectl/terraform commands
- `Nav.jsx` — Redesigned navbar with pill container, active states, Home button
- `Hero.jsx` — Redesigned hero with DevOps-themed animations
- `Footer.jsx` — Clean modern footer with brand info, quick links, terminal message

## Footer Features (Redesigned - April 2026)
| Feature | Description |
|---------|-------------|
| **3-Column Layout** | Brand info, Quick links, Connect section |
| **Brand Column** | Gradient logo icon, name, title, bio, location badge |
| **Quick Links** | Animated hover arrows linking to all sections |
| **Mini Terminal** | Typewriter "Thanks for visiting!" with blinking cursor |
| **Social Icons** | GitHub, LinkedIn, Email with hover lift effects |
| **Tech Divider** | Docker, K8s, Terraform, AWS, Jenkins, Prometheus icons |
| **Bottom Bar** | Copyright, "Crafted with ❤️ & ☕", Back to top button |
| **Background** | Subtle gradient orbs (cyan top-left, purple bottom-right) |

## DevOps Background (Latest Update)
| Element | Count | Examples |
|---------|-------|----------|
| Icon particles | 28 | Docker, K8s, Terraform, AWS, Jenkins, ArgoCD, Prometheus, etc. |
| Text badges | 20 | CI/CD, IaC, GitOps, DevSecOps, SRE, Microservices, Pipeline, Automation, Monitoring, Scaling, HA, DR, Blue-Green, Canary, EKS, Lambda, etc. |

40 unique DevOps keywords as floating text badges with brand colors, mouse parallax, and cursor attraction.

## Hero Features (Latest Redesign - Enhanced Orbital)
| Feature | Description |
|---------|-------------|
| Layout | Content on LEFT, Enhanced orbital visualization on RIGHT |
| **Outermost Ring** | 36 pulsing dots arranged in circle (staggered delays) |
| **Outer Ring** | Rotating dashed ring with glowing markers (25s rotation) |
| **Middle Ring** | Gradient border ring (purple → cyan) with pulse animation |
| **Inner Core** | Glassmorphism circle with holographic sweep effect |
| **Core glow** | Animated pulsing shadows (cyan/purple) with pulse waves |
| **8 Orbiting Tech Icons** | Docker (SiDocker), Kubernetes (SiKubernetes), Terraform (SiTerraform), AWS (FaAws), GCP (SiGooglecloud), GitHub Actions (SiGithubactions), Ansible (SiAnsible), Prometheus (SiPrometheus) |
| **Two orbit levels** | Inner orbit (4 icons, 120px radius) + Outer orbit (4 icons, 170px radius) |
| **Active orbit highlight** | Cycles every 1.5s with scale, glow, rotation effects |
| **Energy pulse waves** | Expanding circles triggered on each active cycle |
| **Data flow ring** | 12 animated particles flowing in circle |
| **Floating code snippets** | kubectl, terraform, JSON examples floating around |
| **SVG connection paths** | Animated lines with moving dots to each orbit position |
| **Scan line effect** | Vertical scanning line moving down |
| Status badge | Multi-layer animated dot (gradient core + 3 expanding rings + ping pulse) + letter wave/shimmer text |
| Gradient name | Flowing gradient on "Charkhwal" |
| Terminal role | `$ DevOps Engineer` typewriter |
| Stats | 2.5+ Years, 13+ Projects, 99.9% Uptime |
| Mobile responsive | Visualization hidden on screens < 900px |

## Navbar Features
| Feature | Description |
|---------|-------------|
| Home button | Left-side button with house icon, links to hero section |
| Pill container | Glassmorphism nav container with blur backdrop |
| Active states | Cyan dot indicator under active link |
| Active detection | Enhanced IntersectionObserver with visibility tracking map, 11 thresholds (0-100%), position bonus scoring |
| CTA button | Shimmer effect on hover (no rotation) |
| Mobile drawer | Slide-in menu with hamburger toggle |

## Contact Cards
| Card | Color | Animation |
|------|-------|-----------|
| Email | #EA4335 (red) | Icon flip (rotateY 180°) |
| LinkedIn | #0A66C2 (blue) | Ring expand + fade |
| Phone | #10b981 (green) | Icon shake (phoneRing) |

## Content Data Location
All portfolio content in `src/data/index.js`:
- `PROJECTS` — Array of 13 DevOps projects (use `.map()`)
- `SKILLS` — 8 skill categories
- `EXPERIENCE` — Work history
- `TERMINAL_LINES` — Terminal animation

## Adding Projects
Edit `src/data/index.js` → `PROJECTS` array:
```javascript
{
  id: 14,  // unique ID
  category: 'cicd',
  catLabel: 'CI/CD Pipeline',
  title: 'Project Title',
  subtitle: 'Brief description',
  objective: 'What it achieves',
  steps: [{ title: 'Step 1', text: 'Description' }],
  aws: ['Service1', 'Service2'],
  outcomes: ['Result 1', 'Result 2']
}
```

## Deployment
- Platform: Vercel
- Config: `vercel.json` → `outputDirectory: "dist"`

## Recent Changes (April 2026)
| Date | Change |
|------|--------|
| Session Latest | Project filter tabs now horizontally scrollable on mobile/tablet (no vertical stacking) |
| Session Prior | Removed all code comments from 12 files, full responsive overhaul with clamp() and min() |
| Session Prior | Added animated Projects header (number badge, shimmer, underline, AWS badge) |
| Session Prior | Filter tabs redesigned with icons, brand colors, count badges |
| Session Prior | Footer redesigned as clean 3-column layout with mini terminal |

## CSS Utility Classes (index.css)
| Class | Usage |
|-------|-------|
| `.hide-scrollbar` | Hides scrollbar while keeping scroll functionality (used on filter bar) |
| `.sc-*` | Section layout classes |
| `.visible` | Fade-in animation trigger |

## Responsive Breakpoints
| Breakpoint | Usage |
|------------|-------|
| `900px` | Hero visualization hidden, layout switches |
| `768px` | Tablet adjustments |
| `600px` | Mobile main breakpoint |
| `480px` | Small phones |
| `380px` | Very small phones |
