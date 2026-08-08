import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'
import FooterSettings from '../models/FooterSettings.js'

// One-time bootstrap — transcribes the Footer's original hardcoded brand copy (was
// inline JSX in src/components/Footer.jsx) into the database, in the exact shape
// footerSettingsController.js's update expects. Not interactive — inserts fixed
// content, nothing to prompt for.

const FOOTER_SETTINGS_DATA = {
  brandName: 'Sunny Charkhwal',
  brandRole: 'DevOps Engineer',
  bio: 'Building scalable infrastructure and automating everything. Passionate about CI/CD, cloud-native technologies, and DevSecOps.',
  terminalCommand: 'echo "Thanks for visiting!"',
}

async function main() {
  await connectDB()

  const admin = await User.findOne().sort({ createdAt: 1 })
  if (!admin) {
    console.error('No admin user found — run `npm run seed` (seedAdmin.js) first.')
    process.exit(1)
  }

  const existing = await FooterSettings.findOne({ user: admin._id })
  if (existing) {
    console.log('FooterSettings: a document already exists for this user, skipping.')
    await mongoose.connection.close()
    process.exit(0)
  }

  await FooterSettings.create({ ...FOOTER_SETTINGS_DATA, user: admin._id })
  console.log('FooterSettings: seeded.')

  await mongoose.connection.close()
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
