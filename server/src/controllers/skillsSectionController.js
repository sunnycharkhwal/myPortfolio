import SkillsSection from '../models/SkillsSection.js'
import { asyncHandler } from '../utils/asyncHandler.js'

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

// Public — no auth required. Drives the copy around the portfolio's Skills grid, so
// every visitor needs to read this without logging in. Returns `{}` (not 404) when
// nothing has been saved yet — Skills.jsx fails open to its own hardcoded defaults in
// that case, same "never let a missing doc break the page" precedent as Hero.jsx.
export const getSkillsSection = asyncHandler(async (req, res) => {
  const section = await SkillsSection.findOne({})
  res.json(section || {})
})

// Protected — the dashboard's Skills "Section Content" form needs the full doc even
// before any fields are filled in the first time (there's no separate "create" step
// for a singleton).
export const getSkillsSectionForEdit = asyncHandler(async (req, res) => {
  const section = await SkillsSection.findOne({ user: req.user.id })
  res.json(section || {})
})

// Protected — always a full replace of every field, matching HeroPanel's "one settings
// form, one Save button" shape. Upserts: creates the singleton on the very first save,
// updates it on every save after that.
export const updateSkillsSection = asyncHandler(async (req, res) => {
  const body = req.body || {}

  const fields = {
    tagline: body.tagline !== undefined ? String(body.tagline) : '',
    stats: pickStatRows(body.stats),
    footerCommand: body.footerCommand !== undefined ? String(body.footerCommand).trim() : '',
  }

  const section = await SkillsSection.findOneAndUpdate(
    { user: req.user.id },
    { $set: fields },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  )

  res.json(section)
})
