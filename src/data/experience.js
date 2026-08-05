import {
  SiReact, SiNextdotjs, SiJavascript, SiTypescript,
  SiTailwindcss, SiGit, SiFigma, SiHtml5,
  SiKubernetes, SiTerraform, SiGithubactions, SiDocker,
} from 'react-icons/si'
import { FaCode, FaRocket, FaUsers, FaChartLine, FaAws, FaCss3Alt } from 'react-icons/fa'

// Work history — newest first, sourced from the resume and rewritten for tone/consistency.
// `current: true` marks the active role.
export const EXPERIENCE = [
  {
    id: 'freelance-devops-frontend',
    current: true,
    title: 'Freelance DevOps & Frontend Engineer',
    company: 'Self-Employed',
    location: 'Delhi, India',
    period: 'Dec 2024 – Present',
    points: [
      'Design and maintain CI/CD pipelines with GitHub Actions, cutting deployment time by 65% — from roughly 40 minutes to under 15 — and containerized 4+ client applications with Docker and Kubernetes.',
      'Author reusable Terraform modules provisioning EC2, S3, RDS, VPC, IAM, and ALB as infrastructure-as-code, removing manual environment setup.',
      "Rebuilt a client's React checkout flow with hooks and lazy loading, cutting load time by 40% and reducing cart abandonment — shipping 15+ features across 8 releases.",
    ],
    tech: [
      { Icon: SiGithubactions, name: 'GitHub Actions', color: '#2088FF' },
      { Icon: SiDocker, name: 'Docker', color: '#2496ED' },
      { Icon: SiKubernetes, name: 'Kubernetes', color: '#326CE5' },
      { Icon: SiTerraform, name: 'Terraform', color: '#7B42BC' },
      { Icon: FaAws, name: 'AWS', color: '#FF9900' },
      { Icon: SiReact, name: 'React', color: '#61DAFB' },
    ],
  },
  {
    id: 'lead-frontend-maxlence',
    current: false,
    title: 'Lead Front-End Developer',
    company: 'Maxlence Digital (OPC) Pvt. Ltd.',
    location: 'Gurugram, India',
    period: 'Apr 2022 – Nov 2024',
    points: [
      'Led a team of 5+ developers, introducing a shared component library and code-review standards that cut PR turnaround time by 35%.',
      'Directed a state-management rebuild that reduced page load time by 30% and cut production crashes, while mentoring 2 junior developers.',
      'Built and maintained a modular React component library, improving reusability across 30+ internal projects.',
    ],
    tech: [
      { Icon: SiReact, name: 'React', color: '#61DAFB' },
      { Icon: SiNextdotjs, name: 'Next.js', color: '#ffffff' },
      { Icon: SiJavascript, name: 'JavaScript', color: '#F7DF1E' },
      { Icon: SiTypescript, name: 'TypeScript', color: '#3178C6' },
      { Icon: SiTailwindcss, name: 'Tailwind', color: '#06B6D4' },
      { Icon: SiGit, name: 'Git', color: '#F05032' },
    ],
  },
  {
    id: 'uiux-massman',
    current: false,
    title: 'UI/UX Designer & Frontend Developer',
    company: 'MassMan Cyber Geeks',
    location: 'Gurugram, India',
    period: 'Apr 2021 – Apr 2022',
    points: [
      'Delivered UI/UX design and front-end development across client projects, earning recognition in two consecutive performance reviews for reliability and consistent delivery.',
    ],
    tech: [
      { Icon: SiFigma, name: 'Figma', color: '#F24E1E' },
      { Icon: SiJavascript, name: 'JavaScript', color: '#F7DF1E' },
      { Icon: SiHtml5, name: 'HTML5', color: '#E34F26' },
      { Icon: FaCss3Alt, name: 'CSS3', color: '#1572B6' },
    ],
  },
  {
    id: 'frontend-schotest',
    current: false,
    title: 'Front-End Developer',
    company: 'SchoTest',
    location: 'Delhi, India',
    period: 'Feb 2020 – Feb 2021',
    points: [
      'Built responsive, high-performance React.js applications with consistent behavior and layout across devices.',
    ],
    tech: [
      { Icon: SiReact, name: 'React', color: '#61DAFB' },
      { Icon: SiJavascript, name: 'JavaScript', color: '#F7DF1E' },
      { Icon: SiHtml5, name: 'HTML5', color: '#E34F26' },
      { Icon: FaCss3Alt, name: 'CSS3', color: '#1572B6' },
    ],
  },
]

export const EXPERIENCE_ACHIEVEMENTS = [
  { icon: FaCode, value: '15+', label: 'Features Shipped', color: '#00d4ff' },
  { icon: FaRocket, value: '30%', label: 'Performance Boost', color: '#a855f7' },
  { icon: FaUsers, value: '5+', label: 'Developers Led', color: '#10b981' },
  { icon: FaChartLine, value: '5+', label: 'Years Experience', color: '#f97316' },
]

// Education — newest first.
export const EDUCATION = [
  {
    id: 'iec-bca',
    degree: 'Bachelor of Computer Applications (BCA)',
    field: 'Computer Software Engineering',
    institution: 'IEC University',
    location: 'Himachal Pradesh, India',
    period: '2019 – 2022',
  },
  {
    id: 'niit-gniit',
    degree: 'gNIIT Program',
    field: 'Computer Software Engineering',
    institution: 'National Institute of Information Technology (NIIT)',
    location: 'India',
    period: '2017 – 2019',
  },
]
