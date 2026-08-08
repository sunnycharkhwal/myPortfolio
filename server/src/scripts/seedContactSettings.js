import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'
import ContactSettings from '../models/ContactSettings.js'

// One-time bootstrap — transcribes the site's original hardcoded contact details (was
// src/data/contact.js's CONTACT_EMAIL/CONTACT_PHONE/etc, plus the GitHub URL and
// location that were hardcoded inline in Footer.jsx) into the database, in the exact
// shape contactSettingsController.js's update expects. Not interactive — inserts fixed
// content, nothing to prompt for.

const CONTACT_SETTINGS_DATA = {
  email: 'sunny.charkhwal@gmail.com',
  phone: '+919013030173',
  phoneDisplay: '+91 901 303 0173',
  linkedinUrl: 'https://www.linkedin.com/in/sunnycharkhwal',
  linkedinHandle: '/in/sunnycharkhwal',
  githubUrl: 'https://github.com/sunnycharkhwal',
  location: 'New Delhi, India',
}

async function main() {
  await connectDB()

  const admin = await User.findOne().sort({ createdAt: 1 })
  if (!admin) {
    console.error('No admin user found — run `npm run seed` (seedAdmin.js) first.')
    process.exit(1)
  }

  const existing = await ContactSettings.findOne({ user: admin._id })
  if (existing) {
    console.log('ContactSettings: a document already exists for this user, skipping.')
    await mongoose.connection.close()
    process.exit(0)
  }

  await ContactSettings.create({ ...CONTACT_SETTINGS_DATA, user: admin._id })
  console.log('ContactSettings: seeded.')

  await mongoose.connection.close()
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
