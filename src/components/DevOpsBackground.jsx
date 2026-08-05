import { useEffect, useRef } from 'react'
import { DEVOPS_ICONS, DEVOPS_BADGES } from '../data/index.js'

const PARTICLE_COUNT = 28
const BADGE_COUNT = 20

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

// Renders once and is then driven entirely by direct DOM/canvas mutation inside a
// single requestAnimationFrame loop — no React state updates on the hot path, since
// this component is always mounted (fixed, full-page background) and re-rendering
// ~50 elements 30x/sec was the main source of scroll jank across the whole site.
export default function DevOpsBackground() {
  const canvasRef = useRef(null)
  const iconElsRef = useRef([])
  const badgeElsRef = useRef([])
  const mouseRef = useRef({ x: null, y: null, active: false })
  const animationRef = useRef(null)

  const particlesRef = useRef(null)
  if (particlesRef.current === null) {
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, (_, i) =>
      new ParticleState(i, i % DEVOPS_ICONS.length, window.innerWidth, window.innerHeight)
    )
  }
  const badgesRef = useRef(null)
  if (badgesRef.current === null) {
    badgesRef.current = Array.from({ length: BADGE_COUNT }, (_, i) =>
      new BadgeParticle(i, i % DEVOPS_BADGES.length, window.innerWidth, window.innerHeight)
    )
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true }
    }
    const handleMouseLeave = () => {
      mouseRef.current = { ...mouseRef.current, active: false }
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = particlesRef.current
    const badges = badgesRef.current

    const drawConnections = (mouseX, mouseY, isMouseActive) => {
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

          particles.slice(i + 1).forEach((p2) => {
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
    }

    let frameCount = 0
    const animate = () => {
      frameCount++
      if (frameCount % 2 === 0) {
        const { x: mouseX, y: mouseY, active: isMouseActive } = mouseRef.current
        const w = window.innerWidth
        const h = window.innerHeight

        particles.forEach((p, idx) => {
          p.update(mouseX, mouseY, isMouseActive, w, h)
          const el = iconElsRef.current[idx]
          if (el) {
            const scale = 1 + Math.sin(p.pulse) * 0.08
            el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) rotate(${p.rotation}deg) scale(${scale})`
            el.style.opacity = p.opacity
          }
        })

        badges.forEach((b, idx) => {
          b.update(mouseX, mouseY, isMouseActive, w, h)
          const el = badgeElsRef.current[idx]
          if (el) {
            const scale = 1 + Math.sin(b.pulse) * 0.05
            el.style.transform = `translate(${b.x}px, ${b.y}px) translate(-50%, -50%) scale(${scale})`
            el.style.opacity = b.opacity
          }
        })

        drawConnections(mouseRef.current.x, mouseRef.current.y, mouseRef.current.active)
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

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

      {particlesRef.current.map((particle, idx) => {
        const { Icon, color } = DEVOPS_ICONS[particle.iconIndex]
        return (
          <div
            key={`icon-${particle.id}`}
            ref={(el) => { iconElsRef.current[idx] = el }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              transform: `translate(${particle.x}px, ${particle.y}px) translate(-50%, -50%) rotate(${particle.rotation}deg)`,
              opacity: particle.opacity,
              fontSize: particle.size,
              color,
              filter: `drop-shadow(0 0 10px ${color}40)`,
              willChange: 'transform, opacity',
              pointerEvents: 'none',
            }}
          >
            <Icon />
          </div>
        )
      })}

      {badgesRef.current.map((badge, idx) => {
        const { label, color } = DEVOPS_BADGES[badge.badgeIndex]
        return (
          <div
            key={`badge-${badge.id}`}
            ref={(el) => { badgeElsRef.current[idx] = el }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              transform: `translate(${badge.x}px, ${badge.y}px) translate(-50%, -50%)`,
              opacity: badge.opacity,
              padding: '6px 14px',
              borderRadius: 20,
              background: `${color}12`,
              border: `1px solid ${color}25`,
              color,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(4px)',
              boxShadow: `0 0 20px ${color}15`,
              willChange: 'transform, opacity',
              pointerEvents: 'none',
            }}
          >
            {label}
          </div>
        )
      })}
    </div>
  )
}
