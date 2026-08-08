import mongoose from 'mongoose'
import FooterLink from '../models/FooterLink.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { isSafeUrl, UNSAFE_URL_MESSAGE } from '../utils/validators.js'

function pickFields(body) {
  const fields = {}
  if (body.label !== undefined) fields.label = String(body.label).trim()
  if (body.href !== undefined) fields.href = String(body.href).trim()
  if (body.order !== undefined) fields.order = Number(body.order) || 0
  if (body.enabled !== undefined) fields.enabled = Boolean(body.enabled)
  return fields
}

// Public — no auth required, same rationale as achievementController.js.
export const listFooterLinks = asyncHandler(async (req, res) => {
  const items = await FooterLink.find({}).sort({ order: 1, createdAt: 1 })
  res.json(items)
})

export const getFooterLink = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const item = await FooterLink.findById(id)
  if (!item) return res.status(404).json({ message: 'Not found' })

  res.json(item)
})

// Everything below requires auth (see routes/footerLinkRoutes.js).
export const createFooterLink = asyncHandler(async (req, res) => {
  const body = req.body || {}

  for (const field of ['label', 'href']) {
    if (!body[field] || !String(body[field]).trim()) {
      return res.status(400).json({ message: `${field} is required` })
    }
  }
  // Renders as a real <a href> in the Footer — reject anything that isn't a real
  // link/anchor so a `javascript:` value can never be stored here.
  if (!isSafeUrl(body.href)) {
    return res.status(400).json({ message: `href: ${UNSAFE_URL_MESSAGE}` })
  }

  const item = await FooterLink.create({
    ...pickFields(body),
    user: req.user.id,
  })

  res.status(201).json(item)
})

export const updateFooterLink = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })
  if (!isSafeUrl(req.body?.href)) {
    return res.status(400).json({ message: `href: ${UNSAFE_URL_MESSAGE}` })
  }

  const item = await FooterLink.findOneAndUpdate(
    { _id: id, user: req.user.id },
    { $set: pickFields(req.body || {}) },
    { new: true, runValidators: true }
  )
  if (!item) return res.status(404).json({ message: 'Not found' })

  res.json(item)
})

export const deleteFooterLink = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const item = await FooterLink.findOneAndDelete({ _id: id, user: req.user.id })
  if (!item) return res.status(404).json({ message: 'Not found' })

  res.status(204).end()
})
