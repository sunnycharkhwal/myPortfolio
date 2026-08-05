import mongoose from 'mongoose'
import Experience from '../models/Experience.js'
import { asyncHandler } from '../utils/asyncHandler.js'

function pickTechRows(tech) {
  if (!Array.isArray(tech)) return []
  return tech
    .filter((row) => row && typeof row === 'object')
    .map((row) => ({
      iconKey: String(row.iconKey || ''),
      name: String(row.name || ''),
      color: String(row.color || ''),
    }))
}

// Only copies fields the client is allowed to set — never trusts the body wholesale,
// so a request can't smuggle in `user` and reassign ownership of a document.
function pickExperienceFields(body) {
  const fields = {}
  if (body.title !== undefined) fields.title = String(body.title).trim()
  if (body.company !== undefined) fields.company = String(body.company).trim()
  if (body.location !== undefined) fields.location = body.location
  if (body.period !== undefined) fields.period = String(body.period).trim()
  if (body.points !== undefined) {
    fields.points = Array.isArray(body.points) ? body.points.filter(Boolean) : []
  }
  if (body.current !== undefined) fields.current = Boolean(body.current)
  if (body.tech !== undefined) fields.tech = pickTechRows(body.tech)
  if (body.order !== undefined) fields.order = Number(body.order) || 0
  return fields
}

// Public — no auth required. Drives the actual portfolio Experience section, so every
// visitor needs to be able to read this without logging in.
export const listExperience = asyncHandler(async (req, res) => {
  const items = await Experience.find({}).sort({ order: 1, createdAt: -1 })
  res.json(items)
})

export const getExperienceEntry = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const entry = await Experience.findById(id)
  if (!entry) return res.status(404).json({ message: 'Not found' })

  res.json(entry)
})

// Everything below requires auth (see routes/experienceRoutes.js).
export const createExperience = asyncHandler(async (req, res) => {
  const body = req.body || {}

  if (!body.title || !String(body.title).trim()) {
    return res.status(400).json({ message: 'title is required' })
  }
  if (!body.company || !String(body.company).trim()) {
    return res.status(400).json({ message: 'company is required' })
  }
  if (!body.period || !String(body.period).trim()) {
    return res.status(400).json({ message: 'period is required' })
  }

  const entry = await Experience.create({
    ...pickExperienceFields(body),
    user: req.user.id,
  })

  res.status(201).json(entry)
})

export const updateExperience = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const entry = await Experience.findOneAndUpdate(
    { _id: id, user: req.user.id },
    { $set: pickExperienceFields(req.body || {}) },
    { new: true, runValidators: true }
  )
  if (!entry) return res.status(404).json({ message: 'Not found' })

  res.json(entry)
})

export const deleteExperience = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const entry = await Experience.findOneAndDelete({ _id: id, user: req.user.id })
  if (!entry) return res.status(404).json({ message: 'Not found' })

  res.status(204).end()
})
