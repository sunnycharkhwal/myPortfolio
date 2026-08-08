import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'
import FooterTechIcon from '../models/FooterTechIcon.js'

// One-time content migration — transcribes the Footer's original static tech-icon
// strip (src/data/footer.js's FOOTER_TECH_STACK) into the database. Not interactive —
// inserts fixed content, nothing to prompt for.

const FOOTER_TECH_ICONS = [
  { iconKey: 'SiDocker', color: '#2496ED' },
  { iconKey: 'SiKubernetes', color: '#326CE5' },
  { iconKey: 'SiTerraform', color: '#7B42BC' },
  { iconKey: 'FaAws', color: '#FF9900' },
  { iconKey: 'SiJenkins', color: '#D24939' },
  { iconKey: 'SiPrometheus', color: '#E6522C' },
]

async function main() {
  await connectDB()

  const admin = await User.findOne().sort({ createdAt: 1 })
  if (!admin) {
    console.error('No admin user found — run `npm run seed` (seedAdmin.js) first.')
    process.exit(1)
  }

  const existingCount = await FooterTechIcon.countDocuments({ user: admin._id })
  if (existingCount > 0) {
    console.log(`FooterTechIcons: ${existingCount} existing doc(s) found, skipping.`)
  } else {
    await FooterTechIcon.insertMany(FOOTER_TECH_ICONS.map((doc, i) => ({ ...doc, order: i, user: admin._id })))
    console.log(`FooterTechIcons: inserted ${FOOTER_TECH_ICONS.length} doc(s).`)
  }

  await mongoose.connection.close()
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
