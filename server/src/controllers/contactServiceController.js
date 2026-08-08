import mongoose from 'mongoose'
import ContactService from '../models/ContactService.js'
import { asyncHandler } from '../utils/asyncHandler.js'

function pickFields(body) {
  const fields = {}
  if (body.icon !== undefined) fields.icon = String(body.icon).trim()
  if (body.title !== undefined) fields.title = String(body.title).trim()
  if (body.desc !== undefined) fields.desc = String(body.desc).trim()
  if (body.color !== undefined) fields.color = String(body.color).trim()
  if (body.order !== undefined) fields.order = Number(body.order) || 0
  if (body.enabled !== undefined) fields.enabled = Boolean(body.enabled)
  return fields
}

// Public — no auth required, same rationale as achievementController.js/skillCategoryController.js.
export const listContactServices = asyncHandler(async (req, res) => {
  const items = await ContactService.find({}).sort({ order: 1, createdAt: -1 })
  res.json(items)
})

export const getContactService = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const item = await ContactService.findById(id)
  if (!item) return res.status(404).json({ message: 'Not found' })

  res.json(item)
})

// Everything below requires auth (see routes/contactServiceRoutes.js).
export const createContactService = asyncHandler(async (req, res) => {
  const body = req.body || {}

  for (const field of ['icon', 'title', 'desc', 'color']) {
    if (!body[field] || !String(body[field]).trim()) {
      return res.status(400).json({ message: `${field} is required` })
    }
  }

  const item = await ContactService.create({
    ...pickFields(body),
    user: req.user.id,
  })

  res.status(201).json(item)
})

export const updateContactService = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const item = await ContactService.findOneAndUpdate(
    { _id: id, user: req.user.id },
    { $set: pickFields(req.body || {}) },
    { new: true, runValidators: true }
  )
  if (!item) return res.status(404).json({ message: 'Not found' })

  res.json(item)
})

export const deleteContactService = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const item = await ContactService.findOneAndDelete({ _id: id, user: req.user.id })
  if (!item) return res.status(404).json({ message: 'Not found' })

  res.status(204).end()
})
