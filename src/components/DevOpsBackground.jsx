import { useEffect, useRef, useState, useMemo } from 'react'
import { 
  SiDocker, SiKubernetes, SiTerraform, SiHelm, SiAnsible,
  SiJenkins, SiGithubactions, SiGitlab, SiCircleci, SiTravisci,
  SiArgo, SiPrometheus, SiGrafana, SiElasticsearch, SiDatadog,
  SiGooglecloud, SiDigitalocean, SiHashicorp,
  SiLinux, SiUbuntu, SiRedhatopenshift, SiNginx, SiApache,
  SiRedis, SiMongodb, SiPostgresql, SiMysql,
  SiGit, SiGithub, SiPython, SiNodedotjs, SiGo,
  SiGnubash, SiPulumi, SiVagrant, SiPacker, SiConsul,
  SiIstio, SiEnvoyproxy, SiRabbitmq, SiApachekafka
} from 'react-icons/si'
import { 
  FaAws, FaServer, FaNetworkWired, FaLock, FaCloud, FaCogs,
  FaCodeBranch, FaShieldAlt, FaDatabase, FaMicrosoft
} from 'react-icons/fa'

const DEVOPS_ICONS = [
  { Icon: SiDocker, color: '#2496ED', name: 'Docker' },
  { Icon: SiKubernetes, color: '#326CE5', name: 'Kubernetes' },
  { Icon: SiTerraform, color: '#7B42BC', name: 'Terraform' },
  { Icon: SiHelm, color: '#0F1689', name: 'Helm' },
  { Icon: SiAnsible, color: '#EE0000', name: 'Ansible' },
  { Icon: SiJenkins, color: '#D24939', name: 'Jenkins' },
  { Icon: SiGithubactions, color: '#2088FF', name: 'GitHub Actions' },
  { Icon: SiGitlab, color: '#FC6D26', name: 'GitLab' },
  { Icon: SiCircleci, color: '#343434', name: 'CircleCI' },
  { Icon: SiTravisci, color: '#3EAAAF', name: 'Travis CI' },
  { Icon: SiArgo, color: '#EF7B4D', name: 'ArgoCD' },
  { Icon: SiPrometheus, color: '#E6522C', name: 'Prometheus' },
  { Icon: SiGrafana, color: '#F46800', name: 'Grafana' },
  { Icon: SiElasticsearch, color: '#005571', name: 'Elasticsearch' },
  { Icon: SiDatadog, color: '#632CA6', name: 'Datadog' },
  { Icon: FaAws, color: '#FF9900', name: 'AWS' },
  { Icon: SiGooglecloud, color: '#4285F4', name: 'GCP' },
  { Icon: FaMicrosoft, color: '#0078D4', name: 'Azure' },
  { Icon: SiDigitalocean, color: '#0080FF', name: 'DigitalOcean' },
  { Icon: SiLinux, color: '#FCC624', name: 'Linux' },
  { Icon: SiUbuntu, color: '#E95420', name: 'Ubuntu' },
  { Icon: SiRedhatopenshift, color: '#EE0000', name: 'OpenShift' },
  { Icon: SiNginx, color: '#009639', name: 'Nginx' },
  { Icon: SiApache, color: '#D22128', name: 'Apache' },
  { Icon: SiRedis, color: '#DC382D', name: 'Redis' },
  { Icon: SiMongodb, color: '#47A248', name: 'MongoDB' },
  { Icon: SiPostgresql, color: '#4169E1', name: 'PostgreSQL' },
  { Icon: SiMysql, color: '#4479A1', name: 'MySQL' },
  { Icon: SiHashicorp, color: '#000', name: 'HashiCorp' },
  { Icon: SiGit, color: '#F05032', name: 'Git' },
  { Icon: SiGithub, color: '#fff', name: 'GitHub' },
  { Icon: SiPython, color: '#3776AB', name: 'Python' },
  { Icon: SiNodedotjs, color: '#339933', name: 'Node.js' },
  { Icon: SiGo, color: '#00ADD8', name: 'Go' },
  { Icon: SiGnubash, color: '#4EAA25', name: 'Bash' },
  { Icon: SiPulumi, color: '#8A3391', name: 'Pulumi' },
  { Icon: SiVagrant, color: '#1868F2', name: 'Vagrant' },
  { Icon: SiPacker, color: '#02A8EF', name: 'Packer' },
  { Icon: SiConsul, color: '#F24C53', name: 'Consul' },
  { Icon: SiIstio, color: '#466BB0', name: 'Istio' },
  { Icon: SiEnvoyproxy, color: '#AC6199', name: 'Envoy' },
  { Icon: SiRabbitmq, color: '#FF6600', name: 'RabbitMQ' },
  { Icon: SiApachekafka, color: '#231F20', name: 'Kafka' },
  { Icon: FaServer, color: '#00d4ff', name: 'Server' },
  { Icon: FaNetworkWired, color: '#a855f7', name: 'Network' },
  { Icon: FaLock, color: '#10b981', name: 'Security' },
  { Icon: FaCloud, color: '#00d4ff', name: 'Cloud' },
  { Icon: FaCogs, color: '#ff6b6b', name: 'Config' },
  { Icon: FaCodeBranch, color: '#a855f7', name: 'Version Control' },
  { Icon: FaShieldAlt, color: '#10b981', name: 'Shield' },
  { Icon: FaDatabase, color: '#00d4ff', name: 'Database' },
]

const DEVOPS_BADGES = [
  { label: 'CI/CD', color: '#10b981' },
  { label: 'IaC', color: '#a855f7' },
  { label: 'GitOps', color: '#00d4ff' },
  { label: 'DevSecOps', color: '#ff6b6b' },
  { label: 'SRE', color: '#FF9900' },
  { label: 'Microservices', color: '#326CE5' },
  { label: 'Containers', color: '#2496ED' },
  { label: 'Serverless', color: '#FF9900' },
  { label: 'Pipeline', color: '#D24939' },
  { label: 'Automation', color: '#10b981' },
  { label: 'Monitoring', color: '#E6522C' },
  { label: 'Logging', color: '#005571' },
  { label: 'Scaling', color: '#00d4ff' },
  { label: 'HA', color: '#10b981' },
  { label: 'DR', color: '#ff6b6b' },
  { label: 'Secrets', color: '#a855f7' },
  { label: 'Mesh', color: '#466BB0' },
  { label: 'Observability', color: '#F46800' },
  { label: 'Blue-Green', color: '#00d4ff' },
  { label: 'Canary', color: '#fbbf24' },
  { label: 'Rollback', color: '#ff6b6b' },
  { label: 'Immutable', color: '#7B42BC' },
  { label: 'Ephemeral', color: '#a855f7' },
  { label: 'Stateless', color: '#00d4ff' },
  { label: 'Helm Charts', color: '#0F1689' },
  { label: 'YAML', color: '#cb171e' },
  { label: 'JSON', color: '#000' },
  { label: 'API', color: '#10b981' },
  { label: 'REST', color: '#00d4ff' },
  { label: 'gRPC', color: '#244c5a' },
  { label: 'Load Balancer', color: '#FF9900' },
  { label: 'CDN', color: '#f38020' },
  { label: 'DNS', color: '#4285F4' },
  { label: 'SSL/TLS', color: '#10b981' },
  { label: 'VPC', color: '#FF9900' },
  { label: 'IAM', color: '#DD344C' },
  { label: 'S3', color: '#569A31' },
  { label: 'EC2', color: '#FF9900' },
  { label: 'EKS', color: '#FF9900' },
  { label: 'Lambda', color: '#FF9900' },
]

class ParticleState {
  constructor(id, iconIndex, windowWidth, windowHeight) {
    this.id = id
    this.iconIndex = iconIndex
    this.x = Math.random() * windowWidth
    this.y = Math.random() * windowHeight
    this.vx = (Math.random() - 0.5) * 0.4
    this.vy = (Math.random() - 0.5) * 0.4
    this.size = 18 + Math.random() * 12
    this.opacity = 0.12 + Math.random() * 0.18
    this.baseOpacity = this.opacity
    this.rotation = Math.random() * 360
    this.rotationSpeed = (Math.random() - 0.5) * 0.3
    this.pulse = Math.random() * Math.PI * 2
  }

  update(mouseX, mouseY, isMouseActive, windowWidth, windowHeight) {

    this.x += this.vx
    this.y += this.vy
    this.rotation += this.rotationSpeed
    this.pulse += 0.02


    if (this.x < -60) this.x = windowWidth + 30
    if (this.x > windowWidth + 60) this.x = -30
    if (this.y < -60) this.y = windowHeight + 30
    if (this.y > windowHeight + 60) this.y = -30


    if (isMouseActive && mouseX != null && mouseY != null) {
      const dx = mouseX - this.x
      const dy = mouseY - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const attractRadius = 280

      if (distance < attractRadius && distance > 0) {
        const force = (1 - distance / attractRadius) * 0.06
        const angle = Math.atan2(dy, dx)
        this.x += Math.cos(angle) * force * 12
        this.y += Math.sin(angle) * force * 12
        this.opacity = Math.min(0.85, this.baseOpacity + (1 - distance / attractRadius) * 0.55)
        this.rotationSpeed = (Math.random() - 0.5) * 1.5
      } else {
        this.opacity += (this.baseOpacity - this.opacity) * 0.04
        this.rotationSpeed *= 0.98
      }
    } else {
      this.opacity += (this.baseOpacity - this.opacity) * 0.04
    }

    return this
  }
}

class BadgeParticle {
  constructor(id, badgeIndex, windowWidth, windowHeight) {
    this.id = id
    this.badgeIndex = badgeIndex
    this.x = Math.random() * windowWidth
    this.y = Math.random() * windowHeight
    this.vx = (Math.random() - 0.5) * 0.25
    this.vy = (Math.random() - 0.5) * 0.25
    this.opacity = 0.08 + Math.random() * 0.12
    this.baseOpacity = this.opacity
    this.pulse = Math.random() * Math.PI * 2
    this.floatOffset = Math.random() * Math.PI * 2
    this.floatSpeed = 0.008 + Math.random() * 0.008
  }

  update(mouseX, mouseY, isMouseActive, windowWidth, windowHeight) {
    this.x += this.vx
    this.y += this.vy + Math.sin(this.floatOffset) * 0.3
    this.pulse += 0.015
    this.floatOffset += this.floatSpeed


    if (this.x < -120) this.x = windowWidth + 60
    if (this.x > windowWidth + 120) this.x = -60
    if (this.y < -60) this.y = windowHeight + 30
    if (this.y > windowHeight + 60) this.y = -30


    if (isMouseActive && mouseX != null && mouseY != null) {
      const dx = mouseX - this.x
      const dy = mouseY - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const attractRadius = 250

      if (distance < attractRadius && distance > 0) {
        const force = (1 - distance / attractRadius) * 0.04
        const angle = Math.atan2(dy, dx)
        this.x += Math.cos(angle) * force * 8
        this.y += Math.sin(angle) * force * 8
        this.opacity = Math.min(0.7, this.baseOpacity + (1 - distance / attractRadius) * 0.45)
      } else {
        this.opacity += (this.baseOpacity - this.opacity) * 0.03
      }
    } else {
      this.opacity += (this.baseOpacity - this.opacity) * 0.03
    }

    return this
  }
}

function FloatingIcon({ particle, icon }) {
  const { Icon, color } = icon
  const scale = 1 + Math.sin(particle.pulse) * 0.08

  return (
    <div
      style={{
        position: 'absolute',
        left: particle.x,
        top: particle.y,
        transform: `translate(-50%, -50%) rotate(${particle.rotation}deg) scale(${scale})`,
        opacity: particle.opacity,
        fontSize: particle.size,
        color: color,
        filter: `drop-shadow(0 0 ${8 + particle.opacity * 12}px ${color}40)`,
        transition: 'opacity 0.15s ease-out',
        willChange: 'transform, opacity',
        pointerEvents: 'none',
      }}
    >
      <Icon />
    </div>
  )
}

function FloatingBadge({ particle, badge }) {
  const scale = 1 + Math.sin(particle.pulse) * 0.05

  return (
    <div
      style={{
        position: 'absolute',
        left: particle.x,
        top: particle.y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity: particle.opacity,
        padding: '6px 14px',
        borderRadius: 20,
        background: `${badge.color}12`,
        border: `1px solid ${badge.color}25`,
        color: badge.color,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
        backdropFilter: 'blur(4px)',
        boxShadow: `0 0 20px ${badge.color}15`,
        transition: 'opacity 0.2s ease-out',
        willChange: 'transform, opacity',
        pointerEvents: 'none',
      }}
    >
      {badge.label}
    </div>
  )
}

function ConnectionCanvas({ particles, mouseX, mouseY, isMouseActive }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (!isMouseActive || mouseX == null) return


    const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 180)
    gradient.addColorStop(0, 'rgba(0, 212, 255, 0.12)')
    gradient.addColorStop(0.4, 'rgba(168, 85, 247, 0.06)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(mouseX, mouseY, 180, 0, Math.PI * 2)
    ctx.fill()


    particles.forEach((p1, i) => {
      const d1 = Math.sqrt((mouseX - p1.x) ** 2 + (mouseY - p1.y) ** 2)
      if (d1 < 220) {

        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(mouseX, mouseY)
        const op = (1 - d1 / 220) * 0.25
        ctx.strokeStyle = `rgba(168, 85, 247, ${op})`
        ctx.lineWidth = 1.5
        ctx.stroke()


        particles.slice(i + 1).forEach(p2 => {
          const d2 = Math.sqrt((mouseX - p2.x) ** 2 + (mouseY - p2.y) ** 2)
          if (d2 < 220) {
            const dist = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
            if (dist < 120) {
              ctx.beginPath()
              ctx.moveTo(p1.x, p1.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.strokeStyle = `rgba(0, 212, 255, ${(1 - dist / 120) * 0.35})`
              ctx.lineWidth = 1
              ctx.stroke()
            }
          }
        })
      }
    })
  }, [particles, mouseX, mouseY, isMouseActive])

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

export default function DevOpsBackground() {
  const [particles, setParticles] = useState([])
  const [badges, setBadges] = useState([])
  const [mouse, setMouse] = useState({ x: null, y: null, active: false })
  const animationRef = useRef(null)
  const particleCount = 28
  const badgeCount = 20


  useEffect(() => {
    const initialParticles = []
    for (let i = 0; i < particleCount; i++) {
      const iconIndex = i % DEVOPS_ICONS.length
      initialParticles.push(
        new ParticleState(i, iconIndex, window.innerWidth, window.innerHeight)
      )
    }
    setParticles(initialParticles)

    const initialBadges = []
    for (let i = 0; i < badgeCount; i++) {
      const badgeIndex = i % DEVOPS_BADGES.length
      initialBadges.push(
        new BadgeParticle(i, badgeIndex, window.innerWidth, window.innerHeight)
      )
    }
    setBadges(initialBadges)
  }, [])


  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouse({ x: e.clientX, y: e.clientY, active: true })
    }
    const handleMouseLeave = () => {
      setMouse(prev => ({ ...prev, active: false }))
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])


  useEffect(() => {
    let frameCount = 0
    
    const animate = () => {
      frameCount++
      if (frameCount % 2 === 0) {

        setParticles(prev => 
          prev.map(p => {
            const updated = Object.assign(
              Object.create(Object.getPrototypeOf(p)), 
              p
            )
            updated.update(
              mouse.x, 
              mouse.y, 
              mouse.active, 
              window.innerWidth, 
              window.innerHeight
            )
            return updated
          })
        )

        setBadges(prev =>
          prev.map(b => {
            const updated = Object.assign(
              Object.create(Object.getPrototypeOf(b)),
              b
            )
            updated.update(
              mouse.x,
              mouse.y,
              mouse.active,
              window.innerWidth,
              window.innerHeight
            )
            return updated
          })
        )
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mouse])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <ConnectionCanvas
        particles={particles}
        mouseX={mouse.x}
        mouseY={mouse.y}
        isMouseActive={mouse.active}
      />
      
      {particles.map(particle => (
        <FloatingIcon
          key={`icon-${particle.id}`}
          particle={particle}
          icon={DEVOPS_ICONS[particle.iconIndex]}
        />
      ))}
      
      {badges.map(badge => (
        <FloatingBadge
          key={`badge-${badge.id}`}
          particle={badge}
          badge={DEVOPS_BADGES[badge.badgeIndex]}
        />
      ))}
    </div>
  )
}
