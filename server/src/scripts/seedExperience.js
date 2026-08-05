import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'
import Experience from '../models/Experience.js'
import Achievement from '../models/Achievement.js'
import Education from '../models/Education.js'

// One-time content migration — transcribes the site's original static content
// (src/data/experience.js) into the database, with icon component references
// replaced by the string iconKey each corresponds to in src/utils/iconRegistry.js.
// Not interactive like seedAdmin.js — this inserts fixed content, nothing to prompt for.

const WORK_HISTORY = [
  {
    title: 'Freelance DevOps & Frontend Engineer',
    company: 'Self-Employed',
    location: 'Delhi, India',
    period: 'Dec 2024 – Present',
    current: true,
    points: [
      'Design and maintain CI/CD pipelines with GitHub Actions, cutting deployment time by 65% — from roughly 40 minutes to under 15 — and containerized 4+ client applications with Docker and Kubernetes.',
      'Author reusable Terraform modules provisioning EC2, S3, RDS, VPC, IAM, and ALB as infrastructure-as-code, removing manual environment setup.',
      "Rebuilt a client's React checkout flow with hooks and lazy loading, cutting load time by 40% and reducing cart abandonment — shipping 15+ features across 8 releases.",
    ],
    tech: [
      { iconKey: 'SiGithubactions', name: 'GitHub Actions', color: '#2088FF' },
      { iconKey: 'SiDocker', name: 'Docker', color: '#2496ED' },
      { iconKey: 'SiKubernetes', name: 'Kubernetes', color: '#326CE5' },
      { iconKey: 'SiTerraform', name: 'Terraform', color: '#7B42BC' },
      { iconKey: 'FaAws', name: 'AWS', color: '#FF9900' },
      { iconKey: 'SiReact', name: 'React', color: '#61DAFB' },
    ],
  },
  {
    title: 'Lead Front-End Developer',
    company: 'Maxlence Digital (OPC) Pvt. Ltd.',
    location: 'Gurugram, India',
    period: 'Apr 2022 – Nov 2024',
    current: false,
    points: [
      'Led a team of 5+ developers, introducing a shared component library and code-review standards that cut PR turnaround time by 35%.',
      'Directed a state-management rebuild that reduced page load time by 30% and cut production crashes, while mentoring 2 junior developers.',
      'Built and maintained a modular React component library, improving reusability across 30+ internal projects.',
    ],
    tech: [
      { iconKey: 'SiReact', name: 'React', color: '#61DAFB' },
      { iconKey: 'SiNextdotjs', name: 'Next.js', color: '#ffffff' },
      { iconKey: 'SiJavascript', name: 'JavaScript', color: '#F7DF1E' },
      { iconKey: 'SiTypescript', name: 'TypeScript', color: '#3178C6' },
      { iconKey: 'SiTailwindcss', name: 'Tailwind', color: '#06B6D4' },
      { iconKey: 'SiGit', name: 'Git', color: '#F05032' },
    ],
  },
  {
    title: 'UI/UX Designer & Frontend Developer',
    company: 'MassMan Cyber Geeks',
    location: 'Gurugram, India',
    period: 'Apr 2021 – Apr 2022',
    current: false,
    points: [
      'Delivered UI/UX design and front-end development across client projects, earning recognition in two consecutive performance reviews for reliability and consistent delivery.',
    ],
    tech: [
      { iconKey: 'SiFigma', name: 'Figma', color: '#F24E1E' },
      { iconKey: 'SiJavascript', name: 'JavaScript', color: '#F7DF1E' },
      { iconKey: 'SiHtml5', name: 'HTML5', color: '#E34F26' },
      { iconKey: 'FaCss3Alt', name: 'CSS3', color: '#1572B6' },
    ],
  },
  {
    title: 'Front-End Developer',
    company: 'SchoTest',
    location: 'Delhi, India',
    period: 'Feb 2020 – Feb 2021',
    current: false,
    points: [
      'Built responsive, high-performance React.js applications with consistent behavior and layout across devices.',
    ],
    tech: [
      { iconKey: 'SiReact', name: 'React', color: '#61DAFB' },
      { iconKey: 'SiJavascript', name: 'JavaScript', color: '#F7DF1E' },
      { iconKey: 'SiHtml5', name: 'HTML5', color: '#E34F26' },
      { iconKey: 'FaCss3Alt', name: 'CSS3', color: '#1572B6' },
    ],
  },
]

const ACHIEVEMENTS = [
  { iconKey: 'FaCode', value: '15+', label: 'Features Shipped', color: '#00d4ff' },
  { iconKey: 'FaRocket', value: '30%', label: 'Performance Boost', color: '#a855f7' },
  { iconKey: 'FaUsers', value: '5+', label: 'Developers Led', color: '#10b981' },
  { iconKey: 'FaChartLine', value: '5+', label: 'Years Experience', color: '#f97316' },
]

const EDUCATION_ENTRIES = [
  {
    degree: 'Bachelor of Computer Applications (BCA)',
    field: 'Computer Software Engineering',
    institution: 'IEC University',
    location: 'Himachal Pradesh, India',
    period: '2019 – 2022',
  },
  {
    degree: 'gNIIT Program',
    field: 'Computer Software Engineering',
    institution: 'National Institute of Information Technology (NIIT)',
    location: 'India',
    period: '2017 – 2019',
  },
]

// Idempotent-ish by design: skips a collection entirely if it already has any docs
// for this user, rather than diffing entry-by-entry — this is a one-time bootstrap
// script, not a sync tool, so a coarse guard is the right amount of complexity.
async function seedCollection(Model, docs, user, label) {
  const existingCount = await Model.countDocuments({ user: user._id })
  if (existingCount > 0) {
    console.log(`${label}: ${existingCount} existing doc(s) found, skipping.`)
    return
  }
  await Model.insertMany(docs.map((doc, i) => ({ ...doc, order: i, user: user._id })))
  console.log(`${label}: inserted ${docs.length} doc(s).`)
}

async function main() {
  await connectDB()

  const admin = await User.findOne().sort({ createdAt: 1 })
  if (!admin) {
    console.error('No admin user found — run `npm run seed` (seedAdmin.js) first.')
    process.exit(1)
  }

  await seedCollection(Experience, WORK_HISTORY, admin, 'Experience')
  await seedCollection(Achievement, ACHIEVEMENTS, admin, 'Achievements')
  await seedCollection(Education, EDUCATION_ENTRIES, admin, 'Education')

  await mongoose.connection.close()
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
