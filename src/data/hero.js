import {
  SiDocker, SiKubernetes, SiTerraform, SiGooglecloud,
  SiGithubactions, SiAnsible, SiPrometheus,
} from 'react-icons/si'
import { FaAws } from 'react-icons/fa'

export const HERO_ROLES = ['DevOps Engineer', 'Cloud Architect', 'Platform Engineer', 'SRE Specialist']

export const HERO_TECH_STACK = [
  { icon: SiDocker, name: 'Docker', color: '#2496ED' },
  { icon: SiKubernetes, name: 'Kubernetes', color: '#326CE5' },
  { icon: SiTerraform, name: 'Terraform', color: '#7B42BC' },
  { icon: FaAws, name: 'AWS', color: '#FF9900' },
  { icon: SiGooglecloud, name: 'GCP', color: '#4285F4' },
  { icon: SiGithubactions, name: 'GitHub', color: '#2088FF' },
  { icon: SiAnsible, name: 'Ansible', color: '#EE0000' },
  { icon: SiPrometheus, name: 'Prometheus', color: '#E6522C' },
]

export const HERO_STATS = [
  { value: '2.5+', label: 'Years Experience', color: '#00d4ff' },
  { value: '13+', label: 'Projects Delivered', color: '#a855f7' },
  { value: '99.9%', label: 'Uptime Achieved', color: '#10b981' },
]
