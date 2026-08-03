import {
  SiKubernetes, SiDocker, SiHelm,
  SiJenkins, SiArgo, SiGitlab, SiGithubactions,
  SiTerraform, SiAnsible, SiPrometheus, SiGrafana,
  SiPython, SiGnubash, SiReact, SiNextdotjs,
  SiJavascript, SiHtml5,
} from 'react-icons/si'
import {
  FaAws, FaCloud, FaLock, FaShieldAlt, FaTerminal, FaBug, FaCss3Alt,
} from 'react-icons/fa'

export const SKILLS = [
  {
    title: 'Cloud',
    icon: FaAws,
    color: '#FF9900',
    gradient: 'linear-gradient(135deg, #FF9900 0%, #ff6b00 100%)',
    tags: [
      { name: 'AWS', icon: FaAws },
      { name: 'EKS', icon: SiKubernetes },
      { name: 'Secrets Manager', icon: FaLock },
      { name: 'CloudWatch', icon: FaCloud },
      { name: 'IAM', icon: FaShieldAlt },
    ]
  },
  {
    title: 'Containers',
    icon: SiDocker,
    color: '#2496ED',
    gradient: 'linear-gradient(135deg, #2496ED 0%, #0db7ed 100%)',
    tags: [
      { name: 'Kubernetes', icon: SiKubernetes },
      { name: 'Docker', icon: SiDocker },
      { name: 'Helm', icon: SiHelm },
    ]
  },
  {
    title: 'CI / CD',
    icon: SiJenkins,
    color: '#D24939',
    gradient: 'linear-gradient(135deg, #D24939 0%, #ef6c00 100%)',
    tags: [
      { name: 'Jenkins', icon: SiJenkins },
      { name: 'ArgoCD', icon: SiArgo },
      { name: 'GitLab CI', icon: SiGitlab },
      { name: 'GitHub Actions', icon: SiGithubactions },
    ]
  },
  {
    title: 'IaC',
    icon: SiTerraform,
    color: '#7B42BC',
    gradient: 'linear-gradient(135deg, #7B42BC 0%, #5a2d91 100%)',
    tags: [
      { name: 'Terraform', icon: SiTerraform },
      { name: 'Ansible', icon: SiAnsible },
    ]
  },
  {
    title: 'Observability',
    icon: SiGrafana,
    color: '#F46800',
    gradient: 'linear-gradient(135deg, #F46800 0%, #e6522c 100%)',
    tags: [
      { name: 'Prometheus', icon: SiPrometheus },
      { name: 'Grafana', icon: SiGrafana },
      { name: 'CloudWatch', icon: FaCloud },
    ]
  },
  {
    title: 'Security',
    icon: FaShieldAlt,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    tags: [
      { name: 'SonarQube', icon: FaBug },
      { name: 'Trivy', icon: FaShieldAlt },
      { name: 'OWASP', icon: FaLock },
      { name: 'IAM Roles', icon: FaShieldAlt },
    ]
  },
  {
    title: 'Scripting',
    icon: FaTerminal,
    color: '#00d4ff',
    gradient: 'linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)',
    tags: [
      { name: 'Python', icon: SiPython },
      { name: 'Bash', icon: SiGnubash },
      { name: 'Shell', icon: FaTerminal },
    ]
  },
  {
    title: 'Frontend',
    icon: SiReact,
    color: '#61DAFB',
    gradient: 'linear-gradient(135deg, #61DAFB 0%, #00d4ff 100%)',
    tags: [
      { name: 'React.js', icon: SiReact },
      { name: 'Next.js', icon: SiNextdotjs },
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'HTML5', icon: SiHtml5 },
      { name: 'CSS3', icon: FaCss3Alt },
    ]
  },
]
