import Hero from '../models/Hero.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { isSafeDownloadUrl, UNSAFE_URL_MESSAGE } from '../utils/validators.js'

function toStringArray(value) {
  return Array.isArray(value) ? value.map((v) => String(v).trim()).filter(Boolean) : []
}

function pickStatRows(stats) {
  if (!Array.isArray(stats)) return []
  return stats
    .filter((row) => row && typeof row === 'object')
    .map((row) => ({
      value: String(row.value || '').trim(),
      label: String(row.label || '').trim(),
      color: String(row.color || '').trim(),
      enabled: row.enabled !== false,
    }))
}

function pickTechRows(tech) {
  if (!Array.isArray(tech)) return []
  return tech
    .filter((row) => row && typeof row === 'object')
    .map((row) => ({
      iconKey: String(row.iconKey || '').trim(),
      name: String(row.name || '').trim(),
      color: String(row.color || '').trim(),
      enabled: row.enabled !== false,
    }))
}

// Public — no auth required. Drives the actual portfolio Hero section, so every visitor
// needs to read this without logging in. Returns `{}` (not 404) when nothing has been
// saved yet — Hero.jsx fails open to its own hardcoded defaults in that case, same
// "never let a missing doc break the page" precedent as Experience.jsx/Projects.jsx.
export const getHero = asyncHandler(async (req, res) => {
  const hero = await Hero.findOne({})
  res.json(hero || {})
})

// Protected — the dashboard's HeroPanel needs the full doc even before any fields are
// filled in the first time (there's no separate "create" step for a singleton).
export const getHeroForEdit = asyncHandler(async (req, res) => {
  const hero = await Hero.findOne({ user: req.user.id })
  res.json(hero || {})
})

// Protected — always a full replace of every field, matching HeroPanel's "one settings
// form, one Save button" shape (not a partial PATCH). Upserts: creates the singleton on
// the very first save, updates it on every save after that — so there's nothing to seed
// or provision before an admin can start filling this in from the dashboard.
export const updateHero = asyncHandler(async (req, res) => {
  const body = req.body || {}

  for (const field of ['firstName', 'lastName', 'statusBadge']) {
    if (!body[field] || !String(body[field]).trim()) {
      return res.status(400).json({ message: `${field} is required` })
    }
  }
  // The "Download Resume" button renders this straight as an <a href> on the public
  // site — reject anything that isn't a real link/anchor/data-URI so a `javascript:`
  // value can never be stored here (see server/src/utils/validators.js).
  if (!isSafeDownloadUrl(body.resumeUrl)) {
    return res.status(400).json({ message: `resumeUrl: ${UNSAFE_URL_MESSAGE}` })
  }

  const fields = {
    firstName: String(body.firstName).trim(),
    lastName: String(body.lastName).trim(),
    statusBadge: String(body.statusBadge).trim(),
    roles: toStringArray(body.roles),
    bio: body.bio !== undefined ? String(body.bio) : '',
    stats: pickStatRows(body.stats),
    techStack: pickTechRows(body.techStack),
    resumeUrl: body.resumeUrl !== undefined ? String(body.resumeUrl).trim() : '',
  }

  const hero = await Hero.findOneAndUpdate(
    { user: req.user.id },
    { $set: fields },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  )

  res.json(hero)
})
