import FooterSettings from '../models/FooterSettings.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// Public — no auth required. Drives the Footer's brand copy, so every visitor needs to
// read this without logging in. Returns `{}` (not 404) when nothing has been saved
// yet — Footer.jsx fails open to its own hardcoded defaults in that case, same "never
// let a missing doc break the page" precedent as Hero.jsx/ContactSettings.
export const getFooterSettings = asyncHandler(async (req, res) => {
  const settings = await FooterSettings.findOne({})
  res.json(settings || {})
})

// Protected — the dashboard's Footer "Settings" form needs the full doc even before
// any fields are filled in the first time (there's no separate "create" step for a
// singleton).
export const getFooterSettingsForEdit = asyncHandler(async (req, res) => {
  const settings = await FooterSettings.findOne({ user: req.user.id })
  res.json(settings || {})
})

// Protected — always a full replace of every field, matching HeroPanel's "one settings
// form, one Save button" shape. Upserts: creates the singleton on the very first save,
// updates it on every save after that.
export const updateFooterSettings = asyncHandler(async (req, res) => {
  const body = req.body || {}

  for (const field of ['brandName', 'brandRole']) {
    if (!body[field] || !String(body[field]).trim()) {
      return res.status(400).json({ message: `${field} is required` })
    }
  }

  const fields = {
    brandName: String(body.brandName).trim(),
    brandRole: String(body.brandRole).trim(),
    bio: body.bio !== undefined ? String(body.bio).trim() : '',
    terminalCommand: body.terminalCommand !== undefined ? String(body.terminalCommand).trim() : '',
  }

  const settings = await FooterSettings.findOneAndUpdate(
    { user: req.user.id },
    { $set: fields },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  )

  res.json(settings)
})
