import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'
import Hero from '../models/Hero.js'

// One-time bootstrap — transcribes the site's original hardcoded Hero content (was
// spread across src/data/hero.js and inline JSX in src/components/Hero.jsx) into the
// database, in the exact shape heroController.js's updateHero expects. The bio's
// inline accent-color spans are written as real HTML here (<span style="color:...">)
// so the dashboard's rich-text editor and the public site's sanitized rendering both
// reproduce the original 5-color highlight design exactly, not an approximation.
// Not interactive — inserts fixed content, nothing to prompt for.

const BIO_HTML =
  '<p>Crafting <span style="color: #00d4ff; font-weight: 600">scalable cloud infrastructure</span> and automating ' +
  '<span style="color: #a855f7; font-weight: 600">CI/CD pipelines</span> on AWS, backed by ' +
  '<span style="color: #10b981; font-weight: 600">5+ years</span> of engineering experience — including ' +
  '<span style="color: #f97316; font-weight: 600">2+ years</span> leading production ' +
  '<span style="color: #61DAFB; font-weight: 600">React.js</span> teams before transitioning into DevOps.</p>'

const HERO_DATA = {
  firstName: 'Sunny',
  lastName: 'Charkhwal',
  statusBadge: 'Open to Opportunities',
  roles: ['DevOps Engineer', 'Cloud & Infrastructure Engineer', 'CI/CD Specialist', 'Former Lead Frontend Developer'],
  bio: BIO_HTML,
  stats: [
    { value: '5+', label: 'Years Experience', color: '#00d4ff' },
    { value: '16+', label: 'Projects Delivered', color: '#a855f7' },
    { value: '99.9%', label: 'Uptime Achieved', color: '#10b981' },
  ],
  techStack: [
    { iconKey: 'SiDocker', name: 'Docker', color: '#2496ED' },
    { iconKey: 'SiKubernetes', name: 'Kubernetes', color: '#326CE5' },
    { iconKey: 'SiTerraform', name: 'Terraform', color: '#7B42BC' },
    { iconKey: 'FaAws', name: 'AWS', color: '#FF9900' },
    { iconKey: 'SiHelm', name: 'Helm', color: '#0F1689' },
    { iconKey: 'SiGithubactions', name: 'GitHub', color: '#2088FF' },
    { iconKey: 'SiAnsible', name: 'Ansible', color: '#EE0000' },
    { iconKey: 'SiPrometheus', name: 'Prometheus', color: '#E6522C' },
  ],
}

async function main() {
  await connectDB()

  const admin = await User.findOne().sort({ createdAt: 1 })
  if (!admin) {
    console.error('No admin user found — run `npm run seed` (seedAdmin.js) first.')
    process.exit(1)
  }

  const existing = await Hero.findOne({ user: admin._id })
  if (existing) {
    console.log('Hero: a document already exists for this user, skipping.')
    await mongoose.connection.close()
    process.exit(0)
  }

  await Hero.create({ ...HERO_DATA, user: admin._id })
  console.log('Hero: seeded.')

  await mongoose.connection.close()
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
