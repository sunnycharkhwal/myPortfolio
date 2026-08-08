import ContactSettings from '../models/ContactSettings.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { isSafeUrl, UNSAFE_URL_MESSAGE } from '../utils/validators.js'

// Public — no auth required. Drives the portfolio's Contact section AND Footer, so
// every visitor needs to read this without logging in. Returns `{}` (not 404) when
// nothing has been saved yet — Contact.jsx/Footer.jsx fail open to their own hardcoded
// defaults in that case, same "never let a missing doc break the page" precedent as
// Hero.jsx/SkillsSection.
export const getContactSettings = asyncHandler(async (req, res) => {
  const settings = await ContactSettings.findOne({})
  res.json(settings || {})
})

// Protected — the dashboard's Contact "Settings" form needs the full doc even before
// any fields are filled in the first time (there's no separate "create" step for a
// singleton).
export const getContactSettingsForEdit = asyncHandler(async (req, res) => {
  const settings = await ContactSettings.findOne({ user: req.user.id })
  res.json(settings || {})
})

// Protected — always a full replace of every field, matching HeroPanel's "one settings
// form, one Save button" shape. Upserts: creates the singleton on the very first save,
// updates it on every save after that.
export const updateContactSettings = asyncHandler(async (req, res) => {
  const body = req.body || {}

  for (const field of ['email', 'phone', 'phoneDisplay']) {
    if (!body[field] || !String(body[field]).trim()) {
      return res.status(400).json({ message: `${field} is required` })
    }
  }
  // linkedinUrl/githubUrl render as real <a href> on the Contact section and Footer —
  // reject anything that isn't a real link so a `javascript:` value can never be
  // stored here.
  for (const field of ['linkedinUrl', 'githubUrl']) {
    if (!isSafeUrl(body[field])) {
      return res.status(400).json({ message: `${field}: ${UNSAFE_URL_MESSAGE}` })
    }
  }

  const fields = {
    email: String(body.email).trim(),
    phone: String(body.phone).trim(),
    phoneDisplay: String(body.phoneDisplay).trim(),
    linkedinUrl: body.linkedinUrl !== undefined ? String(body.linkedinUrl).trim() : '',
    linkedinHandle: body.linkedinHandle !== undefined ? String(body.linkedinHandle).trim() : '',
    githubUrl: body.githubUrl !== undefined ? String(body.githubUrl).trim() : '',
    location: body.location !== undefined ? String(body.location).trim() : '',
  }

  const settings = await ContactSettings.findOneAndUpdate(
    { user: req.user.id },
    { $set: fields },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  )

  res.json(settings)
})
