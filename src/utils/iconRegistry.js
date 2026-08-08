import {
  SiReact, SiNextdotjs, SiJavascript, SiTypescript,
  SiTailwindcss, SiGit, SiFigma, SiHtml5,
  SiKubernetes, SiTerraform, SiGithubactions, SiDocker, SiPrometheus,
  SiHelm, SiAnsible,
  // Added for the Skills (Tech Stack) section — src/data/skills.js's original icon set.
  SiJenkins, SiArgo, SiGitlab, SiGrafana, SiPython, SiGnubash, SiLinux,
} from 'react-icons/si'
import {
  FaCode, FaRocket, FaUsers, FaChartLine, FaAws, FaCss3Alt,
  FaCloud, FaShieldAlt, FaDatabase, FaExclamationTriangle,
  FaCubes, FaDollarSign, FaServer, FaLayerGroup, FaShoppingCart,
  FaChartBar, FaLaptopCode,
  // Added for the Skills (Tech Stack) section — src/data/skills.js's original icon set.
  FaLock, FaTerminal, FaBug, FaNetworkWired, FaRandom, FaRoute, FaArchive,
} from 'react-icons/fa'
import { HiViewGrid } from 'react-icons/hi'

// Maps a stable string key (stored in Mongo as `iconKey`, since neither Mongo nor JSON
// can hold a React component reference) to the actual icon component. Single source of
// truth for both the dashboard's icon picker and the public Experience/Projects/Skills
// renderers — add a new icon here first whenever one needs to become selectable.
export const ICON_REGISTRY = {
  SiReact, SiNextdotjs, SiJavascript, SiTypescript,
  SiTailwindcss, SiGit, SiFigma, SiHtml5,
  SiKubernetes, SiTerraform, SiGithubactions, SiDocker, SiPrometheus,
  SiHelm, SiAnsible,
  SiJenkins, SiArgo, SiGitlab, SiGrafana, SiPython, SiGnubash, SiLinux,
  FaCode, FaRocket, FaUsers, FaChartLine, FaAws, FaCss3Alt,
  FaCloud, FaShieldAlt, FaDatabase, FaExclamationTriangle,
  FaCubes, FaDollarSign, FaServer, FaLayerGroup, FaShoppingCart,
  FaChartBar, FaLaptopCode,
  FaLock, FaTerminal, FaBug, FaNetworkWired, FaRandom, FaRoute, FaArchive,
  HiViewGrid,
}

export const ICON_KEYS = Object.keys(ICON_REGISTRY)

// Falls back to a neutral icon rather than crashing if a document has a stale/unknown
// iconKey (e.g. one that predates a registry change).
export function resolveIcon(iconKey) {
  return ICON_REGISTRY[iconKey] || FaCode
}
