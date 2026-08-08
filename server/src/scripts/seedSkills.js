import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'
import SkillCategory from '../models/SkillCategory.js'

// One-time content migration — transcribes the site's original static content
// (src/data/skills.js) into the database, with icon component references replaced by
// the string iconKey each corresponds to in src/utils/iconRegistry.js. Not interactive
// like seedAdmin.js — this inserts fixed content, nothing to prompt for. Same shape/
// idempotency pattern as seedExperience.js.

const SKILL_CATEGORIES = [
  {
    title: 'Cloud',
    iconKey: 'FaAws',
    color: '#FF9900',
    tags: [
      { name: 'AWS', iconKey: 'FaAws' },
      { name: 'EC2', iconKey: 'FaServer' },
      { name: 'EKS', iconKey: 'SiKubernetes' },
      { name: 'S3', iconKey: 'FaArchive' },
      { name: 'VPC', iconKey: 'FaNetworkWired' },
      { name: 'RDS', iconKey: 'FaDatabase' },
      { name: 'ALB', iconKey: 'FaRandom' },
      { name: 'Route 53', iconKey: 'FaRoute' },
      { name: 'Secrets Manager', iconKey: 'FaLock' },
      { name: 'CloudWatch', iconKey: 'FaCloud' },
      { name: 'IAM', iconKey: 'FaShieldAlt' },
    ],
  },
  {
    title: 'Containers',
    iconKey: 'SiDocker',
    color: '#2496ED',
    tags: [
      { name: 'Kubernetes', iconKey: 'SiKubernetes' },
      { name: 'Docker', iconKey: 'SiDocker' },
      { name: 'Helm', iconKey: 'SiHelm' },
    ],
  },
  {
    title: 'CI / CD',
    iconKey: 'SiJenkins',
    color: '#D24939',
    tags: [
      { name: 'Jenkins', iconKey: 'SiJenkins' },
      { name: 'ArgoCD', iconKey: 'SiArgo' },
      { name: 'GitLab CI', iconKey: 'SiGitlab' },
      { name: 'GitHub Actions', iconKey: 'SiGithubactions' },
    ],
  },
  {
    title: 'IaC',
    iconKey: 'SiTerraform',
    color: '#7B42BC',
    tags: [
      { name: 'Terraform', iconKey: 'SiTerraform' },
      { name: 'Ansible', iconKey: 'SiAnsible' },
      { name: 'CloudFormation', iconKey: 'FaLayerGroup' },
    ],
  },
  {
    title: 'Observability',
    iconKey: 'SiGrafana',
    color: '#F46800',
    tags: [
      { name: 'Prometheus', iconKey: 'SiPrometheus' },
      { name: 'Grafana', iconKey: 'SiGrafana' },
      { name: 'CloudWatch', iconKey: 'FaCloud' },
    ],
  },
  {
    title: 'Security',
    iconKey: 'FaShieldAlt',
    color: '#10b981',
    tags: [
      { name: 'SonarQube', iconKey: 'FaBug' },
      { name: 'Trivy', iconKey: 'FaShieldAlt' },
      { name: 'OWASP', iconKey: 'FaLock' },
      { name: 'IAM/RBAC', iconKey: 'FaShieldAlt' },
    ],
  },
  {
    title: 'Scripting',
    iconKey: 'FaTerminal',
    color: '#00d4ff',
    tags: [
      { name: 'Python', iconKey: 'SiPython' },
      { name: 'Bash', iconKey: 'SiGnubash' },
      { name: 'Shell', iconKey: 'FaTerminal' },
      { name: 'Linux', iconKey: 'SiLinux' },
      { name: 'Git', iconKey: 'SiGit' },
      { name: 'REST APIs', iconKey: 'FaCode' },
    ],
  },
  {
    title: 'Frontend',
    iconKey: 'SiReact',
    color: '#61DAFB',
    tags: [
      { name: 'React.js', iconKey: 'SiReact' },
      { name: 'Next.js', iconKey: 'SiNextdotjs' },
      { name: 'JavaScript', iconKey: 'SiJavascript' },
      { name: 'HTML5', iconKey: 'SiHtml5' },
      { name: 'CSS3', iconKey: 'FaCss3Alt' },
    ],
  },
]

// Idempotent-ish by design: skips entirely if this user already has any docs, rather
// than diffing entry-by-entry — this is a one-time bootstrap script, not a sync tool.
async function main() {
  await connectDB()

  const admin = await User.findOne().sort({ createdAt: 1 })
  if (!admin) {
    console.error('No admin user found — run `npm run seed` (seedAdmin.js) first.')
    process.exit(1)
  }

  const existingCount = await SkillCategory.countDocuments({ user: admin._id })
  if (existingCount > 0) {
    console.log(`Skills: ${existingCount} existing doc(s) found, skipping.`)
  } else {
    await SkillCategory.insertMany(
      SKILL_CATEGORIES.map((doc, i) => ({
        ...doc,
        tags: doc.tags.map((tag) => ({ ...tag, enabled: true })),
        order: i,
        user: admin._id,
      }))
    )
    console.log(`Skills: inserted ${SKILL_CATEGORIES.length} categor${SKILL_CATEGORIES.length === 1 ? 'y' : 'ies'}.`)
  }

  await mongoose.connection.close()
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
