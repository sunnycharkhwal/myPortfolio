import mongoose from 'mongoose'
import SkillCategory from '../models/SkillCategory.js'
import { asyncHandler } from '../utils/asyncHandler.js'

function pickTagRows(tags) {
  if (!Array.isArray(tags)) return []
  return tags
    .filter((row) => row && typeof row === 'object')
    .map((row) => ({
      iconKey: String(row.iconKey || '').trim(),
      name: String(row.name || '').trim(),
      enabled: row.enabled !== false,
    }))
    // Drops rows the admin left half-filled (icon picked but no name typed, or vice
    // versa) rather than persisting an unusable tag — mirrors heroController.js's
    // updateHero, which does the same for stats/techStack via the form itself, except
    // this filter happens server-side since tags aren't validated for non-emptiness
    // the way a category's own required fields are below.
    .filter((row) => row.iconKey && row.name)
}

function pickFields(body) {
  const fields = {}
  if (body.title !== undefined) fields.title = String(body.title).trim()
  if (body.iconKey !== undefined) fields.iconKey = String(body.iconKey).trim()
  if (body.color !== undefined) fields.color = String(body.color).trim()
  if (body.tags !== undefined) fields.tags = pickTagRows(body.tags)
  if (body.order !== undefined) fields.order = Number(body.order) || 0
  if (body.enabled !== undefined) fields.enabled = Boolean(body.enabled)
  return fields
}

// Public — no auth required, same rationale as achievementController.js/educationController.js.
export const listSkillCategories = asyncHandler(async (req, res) => {
  const items = await SkillCategory.find({}).sort({ order: 1, createdAt: -1 })
  res.json(items)
})

export const getSkillCategory = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const item = await SkillCategory.findById(id)
  if (!item) return res.status(404).json({ message: 'Not found' })

  res.json(item)
})

// Everything below requires auth (see routes/skillCategoryRoutes.js).
export const createSkillCategory = asyncHandler(async (req, res) => {
  const body = req.body || {}

  for (const field of ['title', 'iconKey', 'color']) {
    if (!body[field] || !String(body[field]).trim()) {
      return res.status(400).json({ message: `${field} is required` })
    }
  }

  const item = await SkillCategory.create({
    ...pickFields(body),
    user: req.user.id,
  })

  res.status(201).json(item)
})

export const updateSkillCategory = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const item = await SkillCategory.findOneAndUpdate(
    { _id: id, user: req.user.id },
    { $set: pickFields(req.body || {}) },
    { new: true, runValidators: true }
  )
  if (!item) return res.status(404).json({ message: 'Not found' })

  res.json(item)
})

export const deleteSkillCategory = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const item = await SkillCategory.findOneAndDelete({ _id: id, user: req.user.id })
  if (!item) return res.status(404).json({ message: 'Not found' })

  res.status(204).end()
})
