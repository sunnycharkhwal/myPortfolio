import mongoose from 'mongoose'
import ContentPreset from '../models/ContentPreset.js'
import ProjectCategory from '../models/ProjectCategory.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const KINDS = ['objective', 'step', 'tech', 'outcome']

function pickFields(body) {
  const fields = {}
  if (body.kind !== undefined) fields.kind = body.kind
  // Cast to String before it ever reaches a query filter (validateGroup below) or the
  // database — passing the raw value through let a NoSQL query operator object (e.g.
  // `{ "$ne": null }`) slip past the "must match a real category" check.
  if (body.group !== undefined) fields.group = String(body.group).trim()
  if (body.text !== undefined) fields.text = String(body.text).trim()
  if (body.stepTitle !== undefined) fields.stepTitle = String(body.stepTitle).trim()
  if (body.stepText !== undefined) fields.stepText = body.stepText
  if (body.enabled !== undefined) fields.enabled = Boolean(body.enabled)
  if (body.order !== undefined) fields.order = Number(body.order) || 0
  return fields
}

function validateShape(body, res) {
  if (!KINDS.includes(body.kind)) {
    res.status(400).json({ message: `kind must be one of: ${KINDS.join(', ')}` })
    return false
  }
  if (body.kind === 'step') {
    if (!body.stepTitle || !String(body.stepTitle).trim()) {
      res.status(400).json({ message: 'stepTitle is required for a step preset' })
      return false
    }
    if (!body.stepText || !String(body.stepText).trim()) {
      res.status(400).json({ message: 'stepText is required for a step preset' })
      return false
    }
  } else if (!body.text || !String(body.text).trim()) {
    res.status(400).json({ message: 'text is required' })
    return false
  }
  return true
}

// Checks the submitted group slug against the admin-manageable ProjectCategory
// collection's top-level groups (parent: null) — same check projectController.js runs
// for Project.group itself, so a preset can never point at a group that doesn't (or no
// longer) exists. Only runs when `group` is actually present in the body, so a partial
// update that doesn't touch it isn't forced to resupply it.
async function validateGroup(body, userId, res) {
  if (body.group === undefined) return true
  // String(...) here (not just at pickFields' write side) is what actually matters —
  // this is the query filter itself, so a raw object here would be passed straight to
  // MongoDB as a query operator instead of a literal equality check.
  const groupDoc = await ProjectCategory.findOne({ slug: String(body.group), parent: null, user: userId })
  if (!groupDoc) {
    res.status(400).json({ message: `Unknown group: ${body.group}` })
    return false
  }
  return true
}

// Admin-only throughout — every route requires auth (see routes/contentPresetRoutes.js).
// Never exposed to the public site, unlike Project/Experience/etc.

// Optional ?kind=/?group= filters — the dashboard's per-field pickers only ever want one
// kind, and ProjectFormModal only ever wants the project's currently-selected group, so
// filtering server-side avoids shipping the whole library on every field's picker open.
export const listContentPresets = asyncHandler(async (req, res) => {
  const filter = { user: req.user.id }
  if (req.query.kind) {
    if (!KINDS.includes(req.query.kind)) {
      return res.status(400).json({ message: `kind must be one of: ${KINDS.join(', ')}` })
    }
    filter.kind = req.query.kind
  }
  if (req.query.group) {
    filter.group = req.query.group
  }
  const items = await ContentPreset.find(filter).sort({ group: 1, kind: 1, order: 1, createdAt: 1 })
  res.json(items)
})

export const getContentPreset = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const item = await ContentPreset.findOne({ _id: id, user: req.user.id })
  if (!item) return res.status(404).json({ message: 'Not found' })

  res.json(item)
})

export const createContentPreset = asyncHandler(async (req, res) => {
  const body = req.body || {}
  if (!body.group) {
    return res.status(400).json({ message: 'group is required' })
  }
  if (!validateShape(body, res)) return
  if (!(await validateGroup(body, req.user.id, res))) return

  const item = await ContentPreset.create({
    ...pickFields(body),
    user: req.user.id,
  })

  res.status(201).json(item)
})

export const updateContentPreset = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const body = req.body || {}
  // `kind` can't be changed after creation — a step preset switching to e.g. 'outcome'
  // would leave stepTitle/stepText orphaned with no text field populated. Not worth
  // supporting; delete and recreate under the new kind instead.
  if (body.kind !== undefined) {
    return res.status(400).json({ message: 'kind cannot be changed after creation — delete and recreate instead' })
  }
  if (!(await validateGroup(body, req.user.id, res))) return

  const item = await ContentPreset.findOneAndUpdate(
    { _id: id, user: req.user.id },
    { $set: pickFields(body) },
    { new: true, runValidators: true }
  )
  if (!item) return res.status(404).json({ message: 'Not found' })

  res.json(item)
})

export const deleteContentPreset = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const item = await ContentPreset.findOneAndDelete({ _id: id, user: req.user.id })
  if (!item) return res.status(404).json({ message: 'Not found' })

  res.status(204).end()
})
