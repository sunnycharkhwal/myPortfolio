import mongoose from 'mongoose'
import Project from '../models/Project.js'
import ProjectCategory from '../models/ProjectCategory.js'
import { asyncHandler } from '../utils/asyncHandler.js'

function toStringArray(value) {
  return Array.isArray(value) ? value.map((v) => String(v)).filter(Boolean) : []
}

function pickStepRows(steps) {
  if (!Array.isArray(steps)) return []
  return steps
    .filter((row) => row && typeof row === 'object')
    .map((row) => ({ title: String(row.title || ''), text: String(row.text || '') }))
}

function pickDownloadRows(downloads) {
  if (!Array.isArray(downloads)) return []
  return downloads
    .filter((row) => row && typeof row === 'object' && String(row.label || '').trim() && String(row.url || '').trim())
    .map((row) => ({ label: String(row.label).trim(), url: String(row.url) }))
}

// Only copies fields the client is allowed to set — never trusts the body wholesale, so
// a request can't smuggle in `user` and reassign ownership of a document. Returns both
// halves of a Mongo update: `$set` for what to write, `$unset` for the mutually-
// exclusive techStack/aws field that must be actively cleared — assigning `undefined`
// inside a plain object and spreading it into `$set` does NOT clear an existing field
// (BSON serialization just drops `undefined` keys silently), so switching a project's
// `group` on edit would otherwise leave the old array behind.
function pickProjectFields(body) {
  const fields = {}
  const unset = {}

  if (body.title !== undefined) fields.title = String(body.title).trim()
  if (body.subtitle !== undefined) fields.subtitle = String(body.subtitle).trim()
  if (body.group !== undefined) fields.group = body.group
  if (body.category !== undefined) fields.category = body.category
  if (body.catLabel !== undefined) fields.catLabel = String(body.catLabel).trim()
  if (body.images !== undefined) fields.images = toStringArray(body.images)
  if (body.objective !== undefined) fields.objective = body.objective
  if (body.steps !== undefined) fields.steps = pickStepRows(body.steps)
  if (body.outcomes !== undefined) fields.outcomes = toStringArray(body.outcomes)
  if (body.order !== undefined) fields.order = Number(body.order) || 0
  if (body.link !== undefined) fields.link = String(body.link).trim()
  if (body.linkEnabled !== undefined) fields.linkEnabled = Boolean(body.linkEnabled)
  if (body.downloads !== undefined) fields.downloads = pickDownloadRows(body.downloads)

  const group = body.group
  if (group === 'frontend') {
    if (body.techStack !== undefined) fields.techStack = toStringArray(body.techStack)
    unset.aws = ''
  } else if (group === 'devops') {
    if (body.aws !== undefined) fields.aws = toStringArray(body.aws)
    unset.techStack = ''
  }

  return { fields, unset }
}

// Checks the submitted group/category slugs against the admin-manageable
// ProjectCategory collection (no "must be enabled" requirement — see plan: the
// dashboard's project form deliberately still offers disabled categories, and
// resubmitting an existing project's unchanged (possibly since-disabled) category must
// keep working). Only runs the checks for fields actually present in the body, so a
// partial update that doesn't touch group/category isn't forced to resupply both.
async function validateGroupAndCategory(body, userId, res) {
  let groupDoc = null
  if (body.group !== undefined) {
    groupDoc = await ProjectCategory.findOne({ slug: body.group, parent: null, user: userId })
    if (!groupDoc) {
      res.status(400).json({ message: `Unknown group: ${body.group}` })
      return false
    }
  }
  if (body.category !== undefined) {
    const categoryDoc = await ProjectCategory.findOne({ slug: body.category, user: userId }).where('parent').ne(null)
    if (!categoryDoc) {
      res.status(400).json({ message: `Unknown category: ${body.category}` })
      return false
    }
    // Only cross-checked against the group when both are present in the same request —
    // an update that changes only `category` (group unchanged) can't re-verify the
    // parent relationship without an extra lookup, so it's trusted to already be valid.
    if (groupDoc && String(categoryDoc.parent) !== String(groupDoc._id)) {
      res.status(400).json({ message: `Category "${body.category}" does not belong to group "${body.group}"` })
      return false
    }
  }
  return true
}

// Public — no auth required. Drives the actual portfolio Projects section, so every
// visitor needs to be able to read this without logging in.
export const listProjects = asyncHandler(async (req, res) => {
  const items = await Project.find({}).sort({ order: 1, createdAt: -1 })
  res.json(items)
})

export const getProject = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const project = await Project.findById(id)
  if (!project) return res.status(404).json({ message: 'Not found' })

  res.json(project)
})

// Everything below requires auth (see routes/projectRoutes.js).
export const createProject = asyncHandler(async (req, res) => {
  const body = req.body || {}

  if (!body.title || !String(body.title).trim()) {
    return res.status(400).json({ message: 'title is required' })
  }
  if (!body.subtitle || !String(body.subtitle).trim()) {
    return res.status(400).json({ message: 'subtitle is required' })
  }
  if (!body.group) {
    return res.status(400).json({ message: 'group is required' })
  }
  if (!body.category) {
    return res.status(400).json({ message: 'category is required' })
  }
  if (!(await validateGroupAndCategory(body, req.user.id, res))) return
  if (!Array.isArray(body.images) || body.images.filter(Boolean).length === 0) {
    return res.status(400).json({ message: 'At least one image is required' })
  }
  if (!Array.isArray(body.outcomes) || body.outcomes.filter(Boolean).length === 0) {
    return res.status(400).json({ message: 'At least one outcome is required' })
  }

  // A fresh document has no stale opposite-group field to clear, so only `fields`
  // (the `$set` half) is relevant here — `unset` only matters for existing documents.
  const { fields } = pickProjectFields(body)
  const project = await Project.create({
    ...fields,
    user: req.user.id,
  })

  res.status(201).json(project)
})

export const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const body = req.body || {}
  if (!(await validateGroupAndCategory(body, req.user.id, res))) return

  const { fields, unset } = pickProjectFields(body)
  const update = { $set: fields }
  if (Object.keys(unset).length > 0) update.$unset = unset

  const project = await Project.findOneAndUpdate(
    { _id: id, user: req.user.id },
    update,
    { new: true, runValidators: true }
  )
  if (!project) return res.status(404).json({ message: 'Not found' })

  res.json(project)
})

export const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' })

  const project = await Project.findOneAndDelete({ _id: id, user: req.user.id })
  if (!project) return res.status(404).json({ message: 'Not found' })

  res.status(204).end()
})
