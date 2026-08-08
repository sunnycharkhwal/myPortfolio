import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'
import ContentPreset from '../models/ContentPreset.js'
import { PROJECTS } from './seedProjects.js'

// One-time bootstrap for the content-preset library — repurposes the legacy static
// project content (the same 16 projects seedProjects.js already transcribes) as the
// starting set of pre-defined Objective / Step / Tech-or-AWS / Outcome snippets the
// dashboard's ProjectFormModal lets you attach to a new or existing project.
//
// Each preset is tagged with the `group` of the project it came from (frontend/devops),
// so a Frontend project's pickers only ever offer Frontend-sourced presets, never
// DevOps ones and vice versa. Deduping happens *within* each group separately, not
// globally, since the same text landing in two different groups is a legitimate
// coincidence, not a duplicate to collapse — though in practice it doesn't occur here.

function dedupeStrings(values) {
  const seen = new Set()
  const out = []
  for (const raw of values) {
    const text = String(raw || '').trim()
    if (text && !seen.has(text)) {
      seen.add(text)
      out.push(text)
    }
  }
  return out
}

function dedupeSteps(stepLists) {
  const seen = new Set()
  const out = []
  for (const step of stepLists) {
    const title = String(step.title || '').trim()
    const text = String(step.text || '').trim()
    const key = `${title}|${text}`
    if (title && text && !seen.has(key)) {
      seen.add(key)
      out.push({ title, text })
    }
  }
  return out
}

// Buckets every project's content by its own `group` — {frontend: {...}, devops: {...}}
// — so each bucket can be deduped and seeded independently, tagged with that group.
function bucketByGroup(projects) {
  const buckets = {}
  for (const project of projects) {
    const group = project.group
    if (!buckets[group]) buckets[group] = { objectives: [], outcomes: [], tech: [], steps: [] }
    buckets[group].objectives.push(project.objective)
    buckets[group].outcomes.push(...(project.outcomes || []))
    buckets[group].tech.push(...(project.techStack || []), ...(project.aws || []))
    buckets[group].steps.push(...(project.steps || []))
  }
  return buckets
}

async function main() {
  await connectDB()

  const admin = await User.findOne().sort({ createdAt: 1 })
  if (!admin) {
    console.error('No admin user found — run `npm run seed` (seedAdmin.js) first.')
    process.exit(1)
  }

  const existingCount = await ContentPreset.countDocuments({ user: admin._id })
  if (existingCount > 0) {
    console.log(`Content presets: ${existingCount} existing doc(s) found, skipping.`)
    await mongoose.connection.close()
    process.exit(0)
  }

  const buckets = bucketByGroup(PROJECTS)
  const docs = []
  const summary = []

  for (const [group, data] of Object.entries(buckets)) {
    const objectives = dedupeStrings(data.objectives)
    const outcomes = dedupeStrings(data.outcomes)
    const tech = dedupeStrings(data.tech)
    const steps = dedupeSteps(data.steps)

    docs.push(
      ...objectives.map((text, i) => ({ kind: 'objective', group, text, order: i, user: admin._id })),
      ...steps.map((s, i) => ({ kind: 'step', group, stepTitle: s.title, stepText: s.text, order: i, user: admin._id })),
      ...tech.map((text, i) => ({ kind: 'tech', group, text, order: i, user: admin._id })),
      ...outcomes.map((text, i) => ({ kind: 'outcome', group, text, order: i, user: admin._id }))
    )
    summary.push(
      `${group}: ${objectives.length} objectives, ${steps.length} steps, ${tech.length} tech/service names, ${outcomes.length} outcomes`
    )
  }

  await ContentPreset.insertMany(docs)
  console.log(`Content presets: inserted ${docs.length} doc(s).`)
  summary.forEach((line) => console.log(`  - ${line}`))

  await mongoose.connection.close()
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
