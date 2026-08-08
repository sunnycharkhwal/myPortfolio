import SiteSettings from '../models/SiteSettings.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { isSafeUrl, UNSAFE_URL_MESSAGE } from '../utils/validators.js'

const SECTION_KEYS = ['hero', 'skills', 'projects', 'experience', 'contact']
// hero has no heading — Hero.jsx renders its own custom layout, not a SectionHeader
// with a title/num, so only `enabled` is meaningful for it.
const SECTIONS_WITH_HEADING = ['skills', 'projects', 'experience', 'contact']

function pickSections(body) {
  const input = body && typeof body === 'object' ? body : {}
  const sections = {}
  for (const key of SECTION_KEYS) {
    const row = input[key] && typeof input[key] === 'object' ? input[key] : {}
    sections[key] = { enabled: row.enabled !== false }
    if (SECTIONS_WITH_HEADING.includes(key)) {
      if (row.title !== undefined) sections[key].title = String(row.title).trim()
      if (row.num !== undefined) sections[key].num = String(row.num).trim()
    }
  }
  return sections
}

// Public — no auth required. Drives the Nav logo and every section's heading/
// visibility, so every visitor needs to read this without logging in. Returns `{}`
// (not 404) when nothing has been saved yet — every consumer fails open to its own
// hardcoded defaults in that case, same precedent as Hero.jsx/ContactSettings.
export const getSiteSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.findOne({})
  res.json(settings || {})
})

// Protected — the dashboard's Settings "General" form needs the full doc even before
// any fields are filled in the first time (there's no separate "create" step for a
// singleton).
export const getSiteSettingsForEdit = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.findOne({ user: req.user.id })
  res.json(settings || {})
})

// Protected — always a full replace of every field, matching HeroPanel's "one settings
// form, one Save button" shape. Upserts: creates the singleton on the very first save,
// updates it on every save after that.
export const updateSiteSettings = asyncHandler(async (req, res) => {
  const body = req.body || {}

  if (!['text', 'image'].includes(body.logoType)) {
    return res.status(400).json({ message: 'logoType must be "text" or "image"' })
  }
  if (body.logoType === 'text' && !String(body.logoText || '').trim()) {
    return res.status(400).json({ message: 'logoText is required when logoType is "text"' })
  }
  if (body.logoType === 'image' && !String(body.logoImageUrl || '').trim()) {
    return res.status(400).json({ message: 'logoImageUrl is required when logoType is "image"' })
  }
  // Clicking the logo navigates via a real <a href> (see SiteLogo.jsx) — reject
  // anything that isn't a real link/anchor so a `javascript:` value can never be
  // stored here. logoImageUrl is intentionally NOT checked the same way — it's only
  // ever used as an <img src>, which can't execute a javascript: URI.
  if (!isSafeUrl(body.logoLink)) {
    return res.status(400).json({ message: `logoLink: ${UNSAFE_URL_MESSAGE}` })
  }

  const fields = {
    logoType: body.logoType,
    logoText: String(body.logoText || '').trim(),
    logoImageUrl: String(body.logoImageUrl || '').trim(),
    logoLink: String(body.logoLink || '').trim() || '#hero',
    sections: pickSections(body.sections),
  }

  const settings = await SiteSettings.findOneAndUpdate(
    { user: req.user.id },
    { $set: fields },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  )

  res.json(settings)
})
