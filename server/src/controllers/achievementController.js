import mongoose from 'mongoose'
import Achievement from '../models/Achievement.js'
import { asyncHandler } from '../utils/asyncHandler.js'

function pickAchievementFields(body) {
  const fields = {}
  if (body.iconKey !== undefined) fields.iconKey = String(body.iconKey).trim()
  if (body.value !== undefined) fields.value = String(body.value).trim()
  if (body.label !== undefined) fields.label = String(body.label).trim()
  if (body.color !== undefined) fields.color = String(body.color).trim()
  if (body.order !== undefined) fields.order = Number(body.order) || 0
  return fields
}

// Public — no auth required, same rationale as experienceController.js.
export const listAchievements = asyncHandler(async (req, res) => {
  const items = await Achievement.find({}).sort({ order: 1, createdAt: -1 })
  res.json(items)
})

export const getAchievement = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const item = await Achievement.findById(id)
  if (!item) return res.status(404).json({ message: 'Not found' })

  res.json(item)
})

export const createAchievement = asyncHandler(async (req, res) => {
  const body = req.body || {}

  for (const field of ['iconKey', 'value', 'label', 'color']) {
    if (!body[field] || !String(body[field]).trim()) {
      return res.status(400).json({ message: `${field} is required` })
    }
  }

  const item = await Achievement.create({
    ...pickAchievementFields(body),
    user: req.user.id,
  })

  res.status(201).json(item)
})

export const updateAchievement = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const item = await Achievement.findOneAndUpdate(
    { _id: id, user: req.user.id },
    { $set: pickAchievementFields(req.body || {}) },
    { new: true, runValidators: true }
  )
  if (!item) return res.status(404).json({ message: 'Not found' })

  res.json(item)
})

export const deleteAchievement = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const item = await Achievement.findOneAndDelete({ _id: id, user: req.user.id })
  if (!item) return res.status(404).json({ message: 'Not found' })

  res.status(204).end()
})
