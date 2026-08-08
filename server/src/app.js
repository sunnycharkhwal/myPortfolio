import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'
import { env } from './config/env.js'
import { apiLimiter } from './middleware/rateLimiter.js'
import authRoutes from './routes/authRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import projectCategoryRoutes from './routes/projectCategoryRoutes.js'
import experienceRoutes from './routes/experienceRoutes.js'
import achievementRoutes from './routes/achievementRoutes.js'
import educationRoutes from './routes/educationRoutes.js'
import skillCategoryRoutes from './routes/skillCategoryRoutes.js'
import skillsSectionRoutes from './routes/skillsSectionRoutes.js'
import contactServiceRoutes from './routes/contactServiceRoutes.js'
import contactSettingsRoutes from './routes/contactSettingsRoutes.js'
import footerLinkRoutes from './routes/footerLinkRoutes.js'
import footerTechIconRoutes from './routes/footerTechIconRoutes.js'
import footerSettingsRoutes from './routes/footerSettingsRoutes.js'
import siteSettingsRoutes from './routes/siteSettingsRoutes.js'
import siteNavLinkRoutes from './routes/siteNavLinkRoutes.js'
import contentPresetRoutes from './routes/contentPresetRoutes.js'
import heroRoutes from './routes/heroRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'

export const app = express()

// Sets X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security, and friends
// — the browser-facing CSP/frame headers that actually matter for the HTML-rendering
// pages are already set at the edge (vercel.json / nginx.conf), so CSP is switched off
// here (a pure JSON API has nothing for it to protect). crossOriginResourcePolicy is
// relaxed because the frontend (Vercel) and this API (Render) are intentionally
// different origins — the default same-origin policy would block the browser from
// reading fetch() responses here even though CORS below explicitly allows it.
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
)
// Explicit whitelist, never a wildcard — env.CORS_ORIGIN is already parsed into an array.
app.use(
  cors({
    origin: env.CORS_ORIGIN,
  })
)
// Default is 100kb — way too small once project images/downloads can be uploaded as
// base64 data-URIs (a single modestly-sized image is often several hundred KB to a few
// MB as base64). Bumped so those requests don't get silently rejected with a 413.
app.use(express.json({ limit: '15mb' }))

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  })
})

// Generic ceiling on everything under /api — deliberately after /health (which has no
// sensitive data and shouldn't need this) and before every route below, each of which
// still layers its own stricter limiter (auth) or auth requirement (everything else)
// on top of this.
app.use('/api', apiLimiter)

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/project-categories', projectCategoryRoutes)
// Public content (portfolio's Experience section) — reads are open, writes require
// auth. See routes/experienceRoutes.js for the per-route protect() split.
app.use('/api/experience', experienceRoutes)
app.use('/api/achievements', achievementRoutes)
app.use('/api/education', educationRoutes)
// Public content (portfolio's Tech Stack / Skills section) — reads are open, writes
// require auth. See routes/skillCategoryRoutes.js for the per-route protect() split.
app.use('/api/skills', skillCategoryRoutes)
// Public content (the copy around the Skills grid — tagline/stats/footer line) —
// singleton, see routes/skillsSectionRoutes.js.
app.use('/api/skills-section', skillsSectionRoutes)
// Public content (portfolio's Contact section "How I Can Help You" cards) — reads are
// open, writes require auth. See routes/contactServiceRoutes.js for the split.
app.use('/api/contact-services', contactServiceRoutes)
// Public content (the actual email/phone/LinkedIn/GitHub/location — used by Contact.jsx
// AND Footer.jsx) — singleton, see routes/contactSettingsRoutes.js.
app.use('/api/contact-settings', contactSettingsRoutes)
// Public content (Footer's "Quick Links" list) — reads open, writes require auth.
app.use('/api/footer-links', footerLinkRoutes)
// Public content (Footer's tech-icon divider strip) — reads open, writes require auth.
app.use('/api/footer-tech-icons', footerTechIconRoutes)
// Public content (Footer's own brand name/role/bio/terminal line) — singleton, see
// routes/footerSettingsRoutes.js.
app.use('/api/footer-settings', footerSettingsRoutes)
// Public content (site-wide chrome — the Nav logo and every section's own heading text/
// number/visibility toggle) — singleton, see routes/siteSettingsRoutes.js.
app.use('/api/site-settings', siteSettingsRoutes)
// Public content (the Nav bar's link list) — reads open, writes require auth.
app.use('/api/site-nav-links', siteNavLinkRoutes)
// Public content (portfolio's Hero section) — singleton, see routes/heroRoutes.js.
app.use('/api/hero', heroRoutes)
// Dashboard-only — see routes/contentPresetRoutes.js, everything under here requires auth.
app.use('/api/content-presets', contentPresetRoutes)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

// Must be mounted last — Express identifies error middleware by its 4-argument signature.
app.use(errorHandler)
