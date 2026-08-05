import { SiDocker, SiKubernetes, SiTerraform, SiJenkins, SiPrometheus } from 'react-icons/si'
import { FaAws } from 'react-icons/fa'
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { CONTACT_EMAIL, CONTACT_LINKEDIN_URL } from './contact.js'

export const FOOTER_QUICK_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

export const FOOTER_SOCIAL_LINKS = [
  { Icon: FiGithub, href: 'https://github.com/sunnycharkhwal', label: 'GitHub' },
  { Icon: FiLinkedin, href: CONTACT_LINKEDIN_URL, label: 'LinkedIn' },
  { Icon: FiMail, href: `mailto:${CONTACT_EMAIL}`, label: 'Email' },
]

export const FOOTER_TECH_STACK = [
  { Icon: SiDocker, color: '#2496ED' },
  { Icon: SiKubernetes, color: '#326CE5' },
  { Icon: SiTerraform, color: '#7B42BC' },
  { Icon: FaAws, color: '#FF9900' },
  { Icon: SiJenkins, color: '#D24939' },
  { Icon: SiPrometheus, color: '#E6522C' },
]
