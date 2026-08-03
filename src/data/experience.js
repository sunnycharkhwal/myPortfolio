import {
  SiReact, SiNextdotjs, SiJavascript, SiTypescript,
  SiTailwindcss, SiGit, SiWebpack, SiFigma,
} from 'react-icons/si'
import { FaCode, FaRocket, FaUsers, FaChartLine } from 'react-icons/fa'

export const EXPERIENCE = {
  title: 'Lead Front-End Developer',
  company: 'Maxlence Digital (OPC) Pvt. Ltd.',
  location: 'Gurgaon',
  period: 'Apr 2022 – Nov 2024',
  points: [
    'Built and maintained a modular React component library improving reusability across 30+ projects.',
    'Developed high-performance responsive web apps with React.js and Next.js.',
    'Optimised performance via lazy loading, code splitting, and bundle optimisation — reducing load time by ~30%.',
    'Enforced code quality through structured reviews, documentation, and team feedback loops.',
    'Collaborated with UI/UX and product teams to ship user-centric interfaces.',
  ],
}

export const EXPERIENCE_TECH = [
  { Icon: SiReact, name: 'React', color: '#61DAFB' },
  { Icon: SiNextdotjs, name: 'Next.js', color: '#ffffff' },
  { Icon: SiJavascript, name: 'JavaScript', color: '#F7DF1E' },
  { Icon: SiTypescript, name: 'TypeScript', color: '#3178C6' },
  { Icon: SiTailwindcss, name: 'Tailwind', color: '#06B6D4' },
  { Icon: SiGit, name: 'Git', color: '#F05032' },
  { Icon: SiWebpack, name: 'Webpack', color: '#8DD6F9' },
  { Icon: SiFigma, name: 'Figma', color: '#F24E1E' },
]

export const EXPERIENCE_ACHIEVEMENTS = [
  { icon: FaCode, value: '30+', label: 'Projects Delivered', color: '#00d4ff' },
  { icon: FaRocket, value: '30%', label: 'Performance Boost', color: '#a855f7' },
  { icon: FaUsers, value: '5+', label: 'Team Members Led', color: '#10b981' },
  { icon: FaChartLine, value: '2.5+', label: 'Years Experience', color: '#f97316' },
]
