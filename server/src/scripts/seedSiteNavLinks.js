import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'
import SiteNavLink from '../models/SiteNavLink.js'

// One-time content migration — transcribes the Nav bar's original static link list
// (src/data/nav.js's NAV_LINKS, plus the always-first hardcoded "Home" entry Nav.jsx
// itself prepended) into the database. Not interactive — inserts fixed content,
// nothing to prompt for.

const SITE_NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

async function main() {
  await connectDB()

  const admin = await User.findOne().sort({ createdAt: 1 })
  if (!admin) {
    console.error('No admin user found — run `npm run seed` (seedAdmin.js) first.')
    process.exit(1)
  }

  const existingCount = await SiteNavLink.countDocuments({ user: admin._id })
  if (existingCount > 0) {
    console.log(`SiteNavLinks: ${existingCount} existing doc(s) found, skipping.`)
  } else {
    await SiteNavLink.insertMany(SITE_NAV_LINKS.map((doc, i) => ({ ...doc, order: i, user: admin._id })))
    console.log(`SiteNavLinks: inserted ${SITE_NAV_LINKS.length} doc(s).`)
  }

  await mongoose.connection.close()
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
