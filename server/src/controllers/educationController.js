import mongoose from 'mongoose'
import Education from '../models/Education.js'
import { asyncHandler } from '../utils/asyncHandler.js'

function pickEducationFields(body) {
  const fields = {}
  if (body.degree !== undefined) fields.degree = String(body.degree).trim()
  if (body.field !== undefined) fields.field = String(body.field).trim()
  if (body.institution !== undefined) fields.institution = String(body.institution).trim()
  if (body.location !== undefined) fields.location = body.location
  if (body.period !== undefined) fields.period = String(body.period).trim()
  if (body.order !== undefined) fields.order = Number(body.order) || 0
  return fields
}

// Public — no auth required, same rationale as experienceController.js.
export const listEducation = asyncHandler(async (req, res) => {
  const items = await Education.find({}).sort({ order: 1, createdAt: -1 })
  res.json(items)
})

export const getEducationEntry = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const item = await Education.findById(id)
  if (!item) return res.status(404).json({ message: 'Not found' })

  res.json(item)
})

export const createEducation = asyncHandler(async (req, res) => {
  const body = req.body || {}

  for (const field of ['degree', 'field', 'institution', 'period']) {
    if (!body[field] || !String(body[field]).trim()) {
      return res.status(400).json({ message: `${field} is required` })
    }
  }

  const item = await Education.create({
    ...pickEducationFields(body),
    user: req.user.id,
  })

  res.status(201).json(item)
})

export const updateEducation = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const item = await Education.findOneAndUpdate(
    { _id: id, user: req.user.id },
    { $set: pickEducationFields(req.body || {}) },
    { new: true, runValidators: true }
  )
  if (!item) return res.status(404).json({ message: 'Not found' })

  res.json(item)
})

export const deleteEducation = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const item = await Education.findOneAndDelete({ _id: id, user: req.user.id })
  if (!item) return res.status(404).json({ message: 'Not found' })

  res.status(204).end()
})
