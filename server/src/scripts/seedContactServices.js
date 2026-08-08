import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'
import ContactService from '../models/ContactService.js'

// One-time content migration — transcribes the Contact section's original static
// "How I Can Help You" cards (src/data/contact.js's CONTACT_SERVICES) into the
// database, with each entry's two-tone `gradient` collapsed to its first stop as the
// single `color` field (same convention seedSkills.js used for SkillCategory). Not
// interactive — inserts fixed content, nothing to prompt for.

const CONTACT_SERVICES = [
  {
    icon: '☁️',
    title: 'Cloud Architecture',
    desc: 'AWS infrastructure design, provisioning & migration with Terraform',
    color: '#FF9900',
  },
  {
    icon: '🚀',
    title: 'CI/CD Pipelines',
    desc: 'Automated deployments with Jenkins, ArgoCD, GitHub Actions',
    color: '#00d4ff',
  },
  {
    icon: '📦',
    title: 'Container Orchestration',
    desc: 'Kubernetes clusters, Helm charts, Docker optimization',
    color: '#326CE5',
  },
  {
    icon: '🏗️',
    title: 'Infrastructure as Code',
    desc: 'Terraform, Ansible automation & best practices',
    color: '#7B42BC',
  },
  {
    icon: '⚛️',
    title: 'Frontend Engineering',
    desc: 'High-performance React.js & Next.js apps, component libraries & code reviews',
    color: '#61DAFB',
  },
]

async function main() {
  await connectDB()

  const admin = await User.findOne().sort({ createdAt: 1 })
  if (!admin) {
    console.error('No admin user found — run `npm run seed` (seedAdmin.js) first.')
    process.exit(1)
  }

  const existingCount = await ContactService.countDocuments({ user: admin._id })
  if (existingCount > 0) {
    console.log(`ContactServices: ${existingCount} existing doc(s) found, skipping.`)
  } else {
    await ContactService.insertMany(
      CONTACT_SERVICES.map((doc, i) => ({ ...doc, order: i, user: admin._id }))
    )
    console.log(`ContactServices: inserted ${CONTACT_SERVICES.length} doc(s).`)
  }

  await mongoose.connection.close()
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
