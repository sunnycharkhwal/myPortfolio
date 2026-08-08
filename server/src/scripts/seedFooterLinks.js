import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'
import FooterLink from '../models/FooterLink.js'

// One-time content migration — transcribes the Footer's original static "Quick Links"
// (src/data/footer.js's FOOTER_QUICK_LINKS) into the database. Not interactive —
// inserts fixed content, nothing to prompt for.

const FOOTER_LINKS = [
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

  const existingCount = await FooterLink.countDocuments({ user: admin._id })
  if (existingCount > 0) {
    console.log(`FooterLinks: ${existingCount} existing doc(s) found, skipping.`)
  } else {
    await FooterLink.insertMany(FOOTER_LINKS.map((doc, i) => ({ ...doc, order: i, user: admin._id })))
    console.log(`FooterLinks: inserted ${FOOTER_LINKS.length} doc(s).`)
  }

  await mongoose.connection.close()
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
