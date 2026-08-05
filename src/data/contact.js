import {
  SiTerraform,
  SiKubernetes,
  SiDocker,
  SiJenkins,
  SiGrafana,
  SiPrometheus,
  SiHelm,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

// Single source of truth for personal contact details — components should
// import these rather than hardcoding the email/phone/LinkedIn inline.
export const CONTACT_EMAIL = "sunny.charkhwal@gmail.com";
export const CONTACT_PHONE = "+919013030173";
export const CONTACT_PHONE_DISPLAY = "+91 901 303 0173";
export const CONTACT_LINKEDIN_URL = "https://www.linkedin.com/in/sunnycharkhwal";
export const CONTACT_LINKEDIN_HANDLE = "/in/sunnycharkhwal";

export const CONTACT_FLOATING_ICONS = [
  { Icon: SiTerraform, color: "#7B42BC", delay: 0 },
  { Icon: FaAws, color: "#FF9900", delay: 0.5 },
  { Icon: SiKubernetes, color: "#326CE5", delay: 1 },
  { Icon: SiDocker, color: "#2496ED", delay: 1.5 },
  { Icon: SiJenkins, color: "#D24939", delay: 2 },
  { Icon: SiGrafana, color: "#F46800", delay: 2.5 },
  { Icon: SiPrometheus, color: "#E6522C", delay: 3 },
  { Icon: SiHelm, color: "#0F1689", delay: 3.5 },
];

export const CONTACT_SERVICES = [
  {
    icon: "☁️",
    title: "Cloud Architecture",
    desc: "AWS infrastructure design, provisioning & migration with Terraform",
    gradient: "linear-gradient(135deg, #FF9900 0%, #ff6b35 100%)",
  },
  {
    icon: "🚀",
    title: "CI/CD Pipelines",
    desc: "Automated deployments with Jenkins, ArgoCD, GitHub Actions",
    gradient: "linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)",
  },
  {
    icon: "📦",
    title: "Container Orchestration",
    desc: "Kubernetes clusters, Helm charts, Docker optimization",
    gradient: "linear-gradient(135deg, #326CE5 0%, #1e4db7 100%)",
  },
  {
    icon: "🏗️",
    title: "Infrastructure as Code",
    desc: "Terraform, Ansible automation & best practices",
    gradient: "linear-gradient(135deg, #7B42BC 0%, #5a2d91 100%)",
  },
  {
    icon: "⚛️",
    title: "Frontend Engineering",
    desc: "High-performance React.js & Next.js apps, component libraries & code reviews",
    gradient: "linear-gradient(135deg, #61DAFB 0%, #00d4ff 100%)",
  },
];
