import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import Project from '../models/Project.js'
import ProjectCategory from '../models/ProjectCategory.js'

// One-time cleanup — undoes seedProjects.js / seedProjectCategories.js. Those scripts
// transcribed the site's old static placeholder content into MongoDB; this deletes
// exactly those documents by exact title/slug match, so anything you've since added or
// edited by hand through the dashboard is left untouched. Does NOT touch Experience,
// Achievement, or Education (that seeded content is real resume data, not placeholder).

const SEEDED_PROJECT_TITLES = [
  'E-Commerce Platform: Automated Multi-Stage Deployment Pipeline',
  'SaaS Startup: Multi-Environment AWS Infrastructure with Terraform',
  'FinTech App: Dockerized Microservices on Amazon EKS',
  'Retail Chain: Lift-and-Shift + Re-Architecture to AWS',
  'Healthcare SaaS: Full-Stack Observability Platform',
  'Insurance Platform: Security-First CI/CD Pipeline (DevSecOps)',
  'Ride-Sharing App: Automated Incident Response & Runbooks',
  'B2B SaaS: Zero-Downtime Database Schema Migrations',
  'Media Streaming Platform: Service Mesh with AWS App Mesh + EKS',
  'Scale-Up: AWS Cost Optimization & FinOps Program',
  'Banking App: Multi-Region Active-Active DR with Chaos Testing',
  'Government Agency: Strangling a 20-Year-Old Java Monolith',
  'Enterprise Design System: Shared Component Library for 30+ Products',
  'E-Commerce Storefront: High-Conversion Next.js Shopping Experience',
  'Analytics Dashboard: Real-Time Business Intelligence Platform',
  'Marketing Landing Pages: High-Performance Campaign Sites',
]

const SEEDED_CATEGORY_SLUGS = [
  // Groups
  'frontend', 'devops',
  // Frontend sub-categories
  'react-apps', 'ecommerce', 'dashboard', 'landing',
  // DevOps sub-categories
  'cicd', 'iac', 'k8s', 'cloud', 'mon', 'sec', 'inc', 'db', 'mesh', 'fin', 'dr', 'mod',
]

async function main() {
  await connectDB()

  const projectResult = await Project.deleteMany({ title: { $in: SEEDED_PROJECT_TITLES } })
  console.log(`Projects: deleted ${projectResult.deletedCount} doc(s).`)

  const categoryResult = await ProjectCategory.deleteMany({ slug: { $in: SEEDED_CATEGORY_SLUGS } })
  console.log(`Project categories: deleted ${categoryResult.deletedCount} doc(s).`)

  await mongoose.connection.close()
  process.exit(0)
}

main().catch((err) => {
  console.error('Cleanup failed:', err.message)
  process.exit(1)
})
