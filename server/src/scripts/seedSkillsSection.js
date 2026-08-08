import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'
import SkillsSection from '../models/SkillsSection.js'

// One-time bootstrap — transcribes the Skills section's original hardcoded copy (was
// inline JSX in src/components/Skills.jsx: the intro tagline, the 3 stat tiles, and the
// terminal-style footer line) into the database, in the exact shape
// skillsSectionController.js's update expects. The tagline's inline accent-color spans
// are written as real HTML here so the dashboard's rich-text editor and the public
// site's sanitized rendering both reproduce the original 3-color highlight design
// exactly. Not interactive — inserts fixed content, nothing to prompt for.

const TAGLINE_HTML =
  '<p>Technologies I use to build <span style="color: #00d4ff">scalable</span>, ' +
  '<span style="color: #a855f7">secure</span>, and ' +
  '<span style="color: #10b981">automated</span> infrastructure</p>'

const SKILLS_SECTION_DATA = {
  tagline: TAGLINE_HTML,
  stats: [
    { value: '39', label: 'Technologies', color: '#00d4ff' },
    { value: '8', label: 'Categories', color: '#a855f7' },
    { value: '∞', label: 'Learning', color: '#10b981' },
  ],
  footerCommand: 'skills --list --format=awesome',
}

async function main() {
  await connectDB()

  const admin = await User.findOne().sort({ createdAt: 1 })
  if (!admin) {
    console.error('No admin user found — run `npm run seed` (seedAdmin.js) first.')
    process.exit(1)
  }

  const existing = await SkillsSection.findOne({ user: admin._id })
  if (existing) {
    console.log('SkillsSection: a document already exists for this user, skipping.')
    await mongoose.connection.close()
    process.exit(0)
  }

  await SkillsSection.create({ ...SKILLS_SECTION_DATA, user: admin._id })
  console.log('SkillsSection: seeded.')

  await mongoose.connection.close()
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
