import mongoose from 'mongoose'
import FooterTechIcon from '../models/FooterTechIcon.js'
import { asyncHandler } from '../utils/asyncHandler.js'

function pickFields(body) {
  const fields = {}
  if (body.iconKey !== undefined) fields.iconKey = String(body.iconKey).trim()
  if (body.color !== undefined) fields.color = String(body.color).trim()
  if (body.order !== undefined) fields.order = Number(body.order) || 0
  if (body.enabled !== undefined) fields.enabled = Boolean(body.enabled)
  return fields
}

// Public — no auth required, same rationale as achievementController.js.
export const listFooterTechIcons = asyncHandler(async (req, res) => {
  const items = await FooterTechIcon.find({}).sort({ order: 1, createdAt: 1 })
  res.json(items)
})

export const getFooterTechIcon = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const item = await FooterTechIcon.findById(id)
  if (!item) return res.status(404).json({ message: 'Not found' })

  res.json(item)
})

// Everything below requires auth (see routes/footerTechIconRoutes.js).
export const createFooterTechIcon = asyncHandler(async (req, res) => {
  const body = req.body || {}

  for (const field of ['iconKey', 'color']) {
    if (!body[field] || !String(body[field]).trim()) {
      return res.status(400).json({ message: `${field} is required` })
    }
  }

  const item = await FooterTechIcon.create({
    ...pickFields(body),
    user: req.user.id,
  })

  res.status(201).json(item)
})

export const updateFooterTechIcon = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const item = await FooterTechIcon.findOneAndUpdate(
    { _id: id, user: req.user.id },
    { $set: pickFields(req.body || {}) },
    { new: true, runValidators: true }
  )
  if (!item) return res.status(404).json({ message: 'Not found' })

  res.json(item)
})

export const deleteFooterTechIcon = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const item = await FooterTechIcon.findOneAndDelete({ _id: id, user: req.user.id })
  if (!item) return res.status(404).json({ message: 'Not found' })

  res.status(204).end()
})
