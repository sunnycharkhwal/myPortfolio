import mongoose from 'mongoose'
import ProjectCategory from '../models/ProjectCategory.js'
import { asyncHandler } from '../utils/asyncHandler.js'

function pickFields(body) {
  const fields = {}
  if (body.label !== undefined) fields.label = String(body.label).trim()
  if (body.slug !== undefined) fields.slug = String(body.slug).trim().toLowerCase()
  if (body.iconKey !== undefined) fields.iconKey = String(body.iconKey).trim() || 'FaCode'
  if (body.color !== undefined) fields.color = String(body.color).trim() || '#00d4ff'
  if (body.enabled !== undefined) fields.enabled = Boolean(body.enabled)
  if (body.order !== undefined) fields.order = Number(body.order) || 0
  return fields
}

// Public — drives the public site's filter bar. Disabled entries are simply absent, no
// separate "hide" flag to check downstream.
export const listProjectCategories = asyncHandler(async (req, res) => {
  const items = await ProjectCategory.find({ enabled: true }).sort({ order: 1, createdAt: 1 })
  res.json(items)
})

// Protected — the dashboard's Categories panel and the Project form's dropdowns need to
// see disabled entries too, so the admin can re-enable them or knowingly assign one.
export const listAllProjectCategories = asyncHandler(async (req, res) => {
  const items = await ProjectCategory.find({ user: req.user.id }).sort({ order: 1, createdAt: 1 })
  res.json(items)
})

export const createProjectCategory = asyncHandler(async (req, res) => {
  const body = req.body || {}
  if (!body.label || !String(body.label).trim()) {
    return res.status(400).json({ message: 'label is required' })
  }
  if (!body.slug || !String(body.slug).trim()) {
    return res.status(400).json({ message: 'slug is required' })
  }

  let parent = null
  if (body.parent) {
    if (!mongoose.isValidObjectId(body.parent)) {
      return res.status(400).json({ message: 'Invalid parent id' })
    }
    const parentDoc = await ProjectCategory.findOne({ _id: body.parent, user: req.user.id })
    if (!parentDoc) return res.status(400).json({ message: 'Parent group not found' })
    if (parentDoc.parent) {
      return res.status(400).json({ message: 'Cannot nest a sub-category under another sub-category' })
    }
    parent = parentDoc._id
  }

  try {
    const category = await ProjectCategory.create({
      ...pickFields(body),
      parent,
      user: req.user.id,
    })
    res.status(201).json(category)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'A group/category with this slug already exists here' })
    }
    throw err
  }
})

export const updateProjectCategory = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const body = req.body || {}
  const fields = pickFields(body)

  if (body.parent !== undefined) {
    if (body.parent === null || body.parent === '') {
      fields.parent = null
    } else {
      if (!mongoose.isValidObjectId(body.parent)) {
        return res.status(400).json({ message: 'Invalid parent id' })
      }
      if (body.parent === id) {
        return res.status(400).json({ message: 'A category cannot be its own parent' })
      }
      const parentDoc = await ProjectCategory.findOne({ _id: body.parent, user: req.user.id })
      if (!parentDoc) return res.status(400).json({ message: 'Parent group not found' })
      if (parentDoc.parent) {
        return res.status(400).json({ message: 'Cannot nest a sub-category under another sub-category' })
      }
      fields.parent = parentDoc._id
    }
  }

  try {
    const category = await ProjectCategory.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { $set: fields },
      { new: true, runValidators: true }
    )
    if (!category) return res.status(404).json({ message: 'Not found' })
    res.json(category)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'A group/category with this slug already exists here' })
    }
    throw err
  }
})

export const deleteProjectCategory = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const hasChildren = await ProjectCategory.exists({ parent: id, user: req.user.id })
  if (hasChildren) {
    return res.status(400).json({ message: 'Delete or reassign its sub-categories first' })
  }

  const category = await ProjectCategory.findOneAndDelete({ _id: id, user: req.user.id })
  if (!category) return res.status(404).json({ message: 'Not found' })

  res.status(204).end()
})
