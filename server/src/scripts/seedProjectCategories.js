import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'
import ProjectCategory from '../models/ProjectCategory.js'

// One-time content migration — transcribes the site's original static taxonomy
// (src/data/projects.js's PROJECT_GROUPS + PROJECT_CATEGORIES) into the database.
// Icon React components become string `iconKey`s (see src/utils/iconRegistry.js on the
// frontend, which this script's keys must match). The synthetic 'all' group from
// PROJECT_GROUPS stays a frontend-only UI concept — never seeded here.

const GROUPS = [
  { slug: 'frontend', label: 'Frontend', iconKey: 'SiReact', color: '#61DAFB' },
  { slug: 'devops', label: 'DevOps', iconKey: 'FaServer', color: '#00d4ff' },
]

const CATEGORIES = [
  // Frontend
  { slug: 'react-apps', group: 'frontend', label: 'React Apps', iconKey: 'SiReact', color: '#61DAFB' },
  { slug: 'ecommerce', group: 'frontend', label: 'E-Commerce', iconKey: 'FaShoppingCart', color: '#f43f5e' },
  { slug: 'dashboard', group: 'frontend', label: 'Dashboards', iconKey: 'FaChartBar', color: '#14b8a6' },
  { slug: 'landing', group: 'frontend', label: 'Landing Pages', iconKey: 'FaLaptopCode', color: '#eab308' },
  // DevOps
  { slug: 'cicd', group: 'devops', label: 'CI/CD', iconKey: 'FaRocket', color: '#00d4ff' },
  { slug: 'iac', group: 'devops', label: 'IaC', iconKey: 'SiTerraform', color: '#7B42BC' },
  { slug: 'k8s', group: 'devops', label: 'Containers', iconKey: 'SiKubernetes', color: '#326CE5' },
  { slug: 'cloud', group: 'devops', label: 'Cloud', iconKey: 'FaCloud', color: '#FF9900' },
  { slug: 'mon', group: 'devops', label: 'Monitoring', iconKey: 'SiPrometheus', color: '#E6522C' },
  { slug: 'sec', group: 'devops', label: 'Security', iconKey: 'FaShieldAlt', color: '#ff6b6b' },
  { slug: 'inc', group: 'devops', label: 'Incident', iconKey: 'FaExclamationTriangle', color: '#fbbf24' },
  { slug: 'db', group: 'devops', label: 'Database', iconKey: 'FaDatabase', color: '#a855f7' },
  { slug: 'mesh', group: 'devops', label: 'Microservices', iconKey: 'FaCubes', color: '#10b981' },
  { slug: 'fin', group: 'devops', label: 'FinOps', iconKey: 'FaDollarSign', color: '#22c55e' },
  { slug: 'dr', group: 'devops', label: 'DR', iconKey: 'FaServer', color: '#f97316' },
  { slug: 'mod', group: 'devops', label: 'Modernization', iconKey: 'FaLayerGroup', color: '#06b6d4' },
]

async function main() {
  await connectDB()

  const admin = await User.findOne().sort({ createdAt: 1 })
  if (!admin) {
    console.error('No admin user found — run `npm run seed` (seedAdmin.js) first.')
    process.exit(1)
  }

  const existingCount = await ProjectCategory.countDocuments({ user: admin._id })
  if (existingCount > 0) {
    console.log(`Project categories: ${existingCount} existing doc(s) found, skipping.`)
    await mongoose.connection.close()
    process.exit(0)
  }

  // Groups first — sub-categories need the inserted group's real _id as `parent`.
  const groupDocs = {}
  for (let i = 0; i < GROUPS.length; i++) {
    const g = GROUPS[i]
    const doc = await ProjectCategory.create({
      label: g.label,
      slug: g.slug,
      parent: null,
      iconKey: g.iconKey,
      color: g.color,
      enabled: true,
      order: i,
      user: admin._id,
    })
    groupDocs[g.slug] = doc
  }

  let categoryCount = 0
  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i]
    const parent = groupDocs[c.group]
    if (!parent) {
      console.warn(`Skipping category "${c.slug}" — unknown group "${c.group}"`)
      continue
    }
    await ProjectCategory.create({
      label: c.label,
      slug: c.slug,
      parent: parent._id,
      iconKey: c.iconKey,
      color: c.color,
      enabled: true,
      order: i,
      user: admin._id,
    })
    categoryCount += 1
  }

  console.log(`Project categories: inserted ${GROUPS.length} group(s) and ${categoryCount} sub-categor${categoryCount === 1 ? 'y' : 'ies'}.`)

  await mongoose.connection.close()
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
