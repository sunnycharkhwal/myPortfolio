import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'
import SiteSettings from '../models/SiteSettings.js'

// One-time bootstrap — transcribes the site's original hardcoded logo/section-heading
// copy (was inline JSX in Nav.jsx / each section's own <SectionHeader num title />
// call) into the database, in the exact shape siteSettingsController.js's update
// expects. Not interactive — inserts fixed content, nothing to prompt for.

const SITE_SETTINGS_DATA = {
  logoType: 'text',
  logoText: 'SC://dev',
  logoImageUrl: '',
  logoLink: '#hero',
  sections: {
    hero: { enabled: true },
    skills: { enabled: true, title: 'Tech Stack', num: '01' },
    projects: { enabled: true, title: 'Project', num: '02' },
    experience: { enabled: true, title: 'Experience', num: '03' },
    contact: { enabled: true, title: 'Get In Touch', num: '04' },
  },
}

async function main() {
  await connectDB()

  const admin = await User.findOne().sort({ createdAt: 1 })
  if (!admin) {
    console.error('No admin user found — run `npm run seed` (seedAdmin.js) first.')
    process.exit(1)
  }

  const existing = await SiteSettings.findOne({ user: admin._id })
  if (existing) {
    console.log('SiteSettings: a document already exists for this user, skipping.')
    await mongoose.connection.close()
    process.exit(0)
  }

  await SiteSettings.create({ ...SITE_SETTINGS_DATA, user: admin._id })
  console.log('SiteSettings: seeded.')

  await mongoose.connection.close()
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
