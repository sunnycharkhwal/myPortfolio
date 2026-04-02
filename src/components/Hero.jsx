import { useState, useEffect } from 'react'
import scrollTo from '../utils/scrollTo.js'
import { 
  SiDocker, 
  SiKubernetes, 
  SiTerraform, 
  SiGooglecloud,
  SiGithubactions,
  SiAnsible,
  SiPrometheus,
  SiJenkins
} from 'react-icons/si'
import { FaAws } from 'react-icons/fa'
import { HiLightningBolt } from 'react-icons/hi'

export default function Hero() {
  const [typedRole, setTypedRole] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeOrbit, setActiveOrbit] = useState(0)
  const [pulseWave, setPulseWave] = useState(0)
  
  const roles = ['DevOps Engineer', 'Cloud Architect', 'Platform Engineer', 'SRE Specialist']
  const [roleIndex, setRoleIndex] = useState(0)
  

  const techStack = [
    { icon: SiDocker, name: 'Docker', color: '#2496ED' },
    { icon: SiKubernetes, name: 'Kubernetes', color: '#326CE5' },
    { icon: SiTerraform, name: 'Terraform', color: '#7B42BC' },
    { icon: FaAws, name: 'AWS', color: '#FF9900' },
    { icon: SiGooglecloud, name: 'GCP', color: '#4285F4' },
    { icon: SiGithubactions, name: 'GitHub', color: '#2088FF' },
    { icon: SiAnsible, name: 'Ansible', color: '#EE0000' },
    { icon: SiPrometheus, name: 'Prometheus', color: '#E6522C' },
  ]

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])
  

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveOrbit(prev => (prev + 1) % techStack.length)
    }, 1500)
    return () => clearInterval(interval)
  }, [])
  

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseWave(prev => (prev + 1) % 3)
    }, 2000)
    return () => clearInterval(interval)
  }, [])
  
  useEffect(() => {
    const currentRole = roles[roleIndex]
    let charIndex = 0
    let isDeleting = false
    let timeout
    
    const type = () => {
      if (!isDeleting) {
        setTypedRole(currentRole.substring(0, charIndex + 1))
        charIndex++
        if (charIndex === currentRole.length) {
          timeout = setTimeout(() => { isDeleting = true; type() }, 2500)
          return
        }
        timeout = setTimeout(type, 100)
      } else {
        setTypedRole(currentRole.substring(0, charIndex - 1))
        charIndex--
        if (charIndex === 0) {
          isDeleting = false
          setRoleIndex((prev) => (prev + 1) % roles.length)
          return
        }
        timeout = setTimeout(type, 50)
      }
    }
    
    timeout = setTimeout(type, 800)
    return () => clearTimeout(timeout)
  }, [roleIndex])
  
  useEffect(() => {
    const interval = setInterval(() => setShowCursor(c => !c), 530)
    return () => clearInterval(interval)
  }, [])

  return (
    <div 
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'calc(var(--nav-h) + 2rem) clamp(1rem, 4vw, 4rem) 2rem',
        position: 'relative',
        overflow: 'hidden',
        gap: 'clamp(3rem, 8vw, 8rem)',
      }}
    >
      
      <div style={{
        flex: '1 1 min(100%, 400px)',
        maxWidth: 650,
        position: 'relative',
        zIndex: 2,
        width: '100%',
      }}>
        
        <div className="hero-status-badge" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 20px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(0, 212, 255, 0.1) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 50,
          marginBottom: '1.5rem',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '0.1s',
          backdropFilter: 'blur(10px)',
        }}>
          <span className="status-dot">
            <span className="dot-core" />
            <span className="dot-ring dot-ring-1" />
            <span className="dot-ring dot-ring-2" />
            <span className="dot-ring dot-ring-3" />
            <span className="dot-ping" />
          </span>
          <span className="status-text">
            {'Open to Opportunities'.split('').map((char, i) => (
              <span 
                key={i} 
                className="status-letter"
                style={{ 
                  '--i': i,
                  display: char === ' ' ? 'inline' : 'inline-block',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
        </div>

        
        <div style={{
          fontFamily: 'var(--mono)',
          fontSize: 15,
          color: 'var(--muted)',
          marginBottom: '0.75rem',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateX(0)' : 'translateX(-30px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{
            display: 'inline-block',
            width: 30,
            height: 2,
            background: 'linear-gradient(90deg, var(--accent) 0%, transparent 100%)',
            borderRadius: 2,
          }} />
          Hello, I'm
        </div>

        
        <h1 style={{
          fontFamily: 'var(--sans)',
          fontSize: 'clamp(3rem, 7vw, 5rem)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          marginBottom: '1.25rem',
        }}>
          <span style={{
            display: 'block',
            color: 'var(--text)',
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateX(0)' : 'translateX(-50px)',
            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: '0.3s',
          }}>
            Sunny
          </span>
          <span className="gradient-name" style={{
            display: 'block',
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateX(0)' : 'translateX(-50px)',
            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: '0.4s',
          }}>
            Charkhwal
          </span>
        </h1>

        
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 24px',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(20, 20, 30, 0.8) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
          marginBottom: '2rem',
          backdropFilter: 'blur(15px)',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateX(0)' : 'translateX(-30px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '0.5s',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 14, color: '#10b981', fontWeight: 700 }}>$</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 15, color: 'var(--accent)', fontWeight: 600, minWidth: '16ch' }}>
            {typedRole}
          </span>
          <span style={{
            width: 3,
            height: '1.3em',
            background: 'var(--accent)',
            borderRadius: 2,
            opacity: showCursor ? 1 : 0,
            boxShadow: '0 0 8px var(--accent)',
          }} />
        </div>

        
        <p style={{
          fontSize: 'clamp(1.05rem, 1.6vw, 1.2rem)',
          color: 'var(--text-secondary)',
          lineHeight: 1.85,
          marginBottom: '2.5rem',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateX(0)' : 'translateX(-30px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '0.6s',
          maxWidth: 560,
        }}>
          Crafting <span style={{ color: 'var(--accent)', fontWeight: 600 }}>scalable cloud infrastructure</span> and 
          streamlining <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>CI/CD pipelines</span> on AWS.
          Expert in <span style={{ color: '#326CE5', fontWeight: 600 }}>Kubernetes</span>,{' '}
          <span style={{ color: '#7B42BC', fontWeight: 600 }}>Terraform</span>, and{' '}
          <span style={{ color: '#EF7B4D', fontWeight: 600 }}>GitOps</span> methodologies.
        </p>

        
        <div style={{
          display: 'flex',
          gap: '1.25rem',
          flexWrap: 'wrap',
          marginBottom: '3rem',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateX(0)' : 'translateX(-30px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '0.7s',
        }}>
          <button
            className="sc-btn-p hero-cta-primary"
            onClick={() => scrollTo('projects')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 28px', fontSize: 15, fontWeight: 600 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            View Projects
          </button>
          <button
            className="sc-btn-o hero-cta-secondary"
            onClick={() => scrollTo('contact')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 28px', fontSize: 15, fontWeight: 600 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <path d="M22 6l-10 7L2 6"/>
            </svg>
            Get In Touch
          </button>
        </div>

        
        <div style={{
          display: 'flex',
          gap: 'clamp(1.5rem, 4vw, 3rem)',
          flexWrap: 'wrap',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '0.8s',
        }}>
          {[
            { value: '2.5+', label: 'Years Experience', color: '#00d4ff' },
            { value: '13+', label: 'Projects Delivered', color: '#a855f7' },
            { value: '99.9%', label: 'Uptime Achieved', color: '#10b981' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'left', padding: '12px 0', borderLeft: `3px solid ${stat.color}30`, paddingLeft: 16 }}>
              <div style={{
                fontFamily: 'var(--mono)',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
                fontWeight: 800,
                color: stat.color,
                lineHeight: 1,
                marginBottom: 6,
                textShadow: `0 0 30px ${stat.color}40`,
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div 
        className="devops-visual-container"
        style={{
          flex: '0 0 auto',
          position: 'relative',
          width: 'clamp(380px, 45vw, 550px)',
          height: 'clamp(380px, 45vw, 550px)',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'scale(1) rotate(0deg)' : 'scale(0.8) rotate(-15deg)',
          transition: 'all 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '0.3s',
        }}
      >
        
        <div className="ambient-glow" />
        <div className="ambient-glow-2" />
        
        
        <div className="outermost-ring">
          {[...Array(36)].map((_, i) => (
            <div key={i} className="ring-dot" style={{ '--i': i }} />
          ))}
        </div>
        
        
        <div className="outer-ring">
          <div className="ring-marker" />
          <div className="ring-marker ring-marker-2" />
        </div>
        
        
        {[0, 1, 2].map((i) => (
          <div 
            key={i} 
            className={`pulse-wave ${pulseWave === i ? 'active' : ''}`}
            style={{ '--delay': `${i * 0.3}s` }}
          />
        ))}
        
        
        <div className="middle-ring">
          <div className="middle-ring-inner" />
        </div>
        
        
        <div className="data-flow-ring">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="data-particle" style={{ '--i': i }} />
          ))}
        </div>
        
        
        <div className="inner-core">
          <div className="holographic-layer" />
          <div className="core-content">
            <div className="core-icon">
              <span className="icon-main">
                <HiLightningBolt size={32} color="#00d4ff" />
              </span>
              <span className="icon-ring" />
            </div>
            <div className="core-text">DevOps</div>
            <div className="core-subtext">Automation Hub</div>
          </div>
        </div>
        
        
        {techStack.slice(0, 4).map((tech, i) => {
          const angle = (i / 4) * 360 - 45
          const isActive = activeOrbit === i
          const IconComponent = tech.icon
          return (
            <div
              key={tech.name}
              className={`orbit-item inner-orbit ${isActive ? 'active' : ''}`}
              style={{ '--angle': `${angle}deg`, '--color': tech.color, '--i': i }}
            >
              <div className="orbit-glow" />
              <div className="orbit-icon">
                <IconComponent size={24} color={isActive ? '#fff' : tech.color} />
              </div>
              <div className="orbit-label">{tech.name}</div>
              {isActive && <div className="orbit-pulse" />}
            </div>
          )
        })}
        
        
        {techStack.slice(4).map((tech, i) => {
          const angle = (i / 4) * 360 - 22.5
          const isActive = activeOrbit === i + 4
          const IconComponent = tech.icon
          return (
            <div
              key={tech.name}
              className={`orbit-item outer-orbit ${isActive ? 'active' : ''}`}
              style={{ '--angle': `${angle}deg`, '--color': tech.color, '--i': i }}
            >
              <div className="orbit-glow" />
              <div className="orbit-icon">
                <IconComponent size={22} color={isActive ? '#fff' : tech.color} />
              </div>
              <div className="orbit-label">{tech.name}</div>
              {isActive && <div className="orbit-pulse" />}
            </div>
          )
        })}
        
        
        <div className="floating-code code-1">
          <span className="code-bracket">{'{'}</span>
          <span className="code-key">"deploy"</span>
          <span className="code-bracket">{'}'}</span>
        </div>
        <div className="floating-code code-2">
          <span className="code-cmd">$ kubectl</span>
        </div>
        <div className="floating-code code-3">
          <span className="code-cmd">terraform</span>
        </div>
        
        
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="floating-particle"
            style={{
              '--delay': `${i * 0.4}s`,
              '--x': `${10 + Math.random() * 80}%`,
              '--y': `${10 + Math.random() * 80}%`,
              '--size': `${3 + Math.random() * 5}px`,
              '--duration': `${4 + Math.random() * 6}s`,
              '--hue': `${180 + Math.random() * 100}`,
            }}
          />
        ))}
        
        
        <svg className="connection-lines" viewBox="0 0 400 400">
          <defs>
            <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="lineGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.2" />
            </linearGradient>
            <filter id="lineGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          
          <path className="conn-path" d="M200,200 Q150,100 100,120" stroke="url(#lineGrad1)" />
          <path className="conn-path" d="M200,200 Q250,100 300,120" stroke="url(#lineGrad2)" style={{'--delay': '0.3s'}} />
          <path className="conn-path" d="M200,200 Q300,200 320,280" stroke="url(#lineGrad1)" style={{'--delay': '0.6s'}} />
          <path className="conn-path" d="M200,200 Q250,300 300,320" stroke="url(#lineGrad2)" style={{'--delay': '0.9s'}} />
          <path className="conn-path" d="M200,200 Q150,300 100,320" stroke="url(#lineGrad1)" style={{'--delay': '1.2s'}} />
          <path className="conn-path" d="M200,200 Q100,200 80,280" stroke="url(#lineGrad2)" style={{'--delay': '1.5s'}} />
          
          
          <circle r="3" fill="#00d4ff" filter="url(#lineGlow)">
            <animateMotion dur="3s" repeatCount="indefinite" path="M200,200 Q150,100 100,120" />
          </circle>
          <circle r="3" fill="#a855f7" filter="url(#lineGlow)">
            <animateMotion dur="3s" repeatCount="indefinite" path="M200,200 Q250,100 300,120" begin="0.5s" />
          </circle>
          <circle r="3" fill="#10b981" filter="url(#lineGlow)">
            <animateMotion dur="3s" repeatCount="indefinite" path="M200,200 Q300,200 320,280" begin="1s" />
          </circle>
        </svg>
        
        
        <div className="scan-line" />
      </div>

      
      <style>{`
        .status-dot {
          position: relative;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .dot-core {
          position: absolute;
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #10b981 0%, #00d4ff 100%);
          border-radius: 50%;
          box-shadow: 0 0 10px #10b981, 0 0 20px rgba(16, 185, 129, 0.6);
          animation: coreGlow 2s ease-in-out infinite, corePulse 1.5s ease-in-out infinite;
          z-index: 3;
        }
        
        .dot-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(16, 185, 129, 0.4);
          animation: ringExpand 3s ease-out infinite;
        }
        
        .dot-ring-1 {
          width: 8px;
          height: 8px;
          animation-delay: 0s;
        }
        
        .dot-ring-2 {
          width: 8px;
          height: 8px;
          animation-delay: 1s;
        }
        
        .dot-ring-3 {
          width: 8px;
          height: 8px;
          animation-delay: 2s;
        }
        
        .dot-ping {
          position: absolute;
          width: 8px;
          height: 8px;
          background: rgba(16, 185, 129, 0.4);
          border-radius: 50%;
          animation: pingPulse 2s ease-out infinite;
          z-index: 1;
        }
        
        @keyframes coreGlow {
          0%, 100% { 
            box-shadow: 0 0 10px #10b981, 0 0 20px rgba(16, 185, 129, 0.6);
            background: linear-gradient(135deg, #10b981 0%, #00d4ff 100%);
          }
          50% { 
            box-shadow: 0 0 15px #00d4ff, 0 0 30px rgba(0, 212, 255, 0.8), 0 0 45px rgba(16, 185, 129, 0.4);
            background: linear-gradient(135deg, #00d4ff 0%, #10b981 100%);
          }
        }
        
        @keyframes corePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        @keyframes ringExpand {
          0% { 
            transform: scale(1);
            opacity: 0.8;
            border-color: rgba(16, 185, 129, 0.6);
          }
          50% {
            border-color: rgba(0, 212, 255, 0.4);
          }
          100% { 
            transform: scale(3);
            opacity: 0;
            border-color: rgba(0, 212, 255, 0.1);
          }
        }
        
        @keyframes pingPulse {
          0% { 
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.8);
            opacity: 0.3;
          }
          100% { 
            transform: scale(1);
            opacity: 0.6;
          }
        }
        
        .status-text {
          fontFamily: var(--mono);
          fontSize: 13px;
          letterSpacing: 0.05em;
          fontWeight: 600;
          display: inline-flex;
        }
        
        .status-letter {
          color: #10b981;
          animation: letterWave 3s ease-in-out infinite, letterShimmer 4s ease-in-out infinite;
          animation-delay: calc(var(--i) * 0.08s), calc(var(--i) * 0.15s);
          font-family: var(--mono);
          font-size: 13px;
          letter-spacing: 0.05em;
          font-weight: 600;
        }
        
        @keyframes letterWave {
          0%, 100% { 
            transform: translateY(0); 
          }
          25% { 
            transform: translateY(-2px); 
          }
          75% { 
            transform: translateY(1px); 
          }
        }
        
        @keyframes letterShimmer {
          0%, 100% { 
            color: #10b981;
            text-shadow: 0 0 5px rgba(16, 185, 129, 0.3);
          }
          50% { 
            color: #00d4ff;
            text-shadow: 0 0 12px rgba(0, 212, 255, 0.6), 0 0 25px rgba(0, 212, 255, 0.3);
          }
        }
        
        .gradient-name {
          background: linear-gradient(135deg, #00d4ff 0%, #a855f7 40%, #ff6b6b 80%, #f97316 100%);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientFlow 6s ease infinite;
        }
        
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 15px #10b981, 0 0 30px rgba(16, 185, 129, 0.5); transform: scale(1); }
          50% { box-shadow: 0 0 25px #10b981, 0 0 50px rgba(16, 185, 129, 0.7); transform: scale(1.15); }
        }
        
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .devops-visual-container {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Ambient glows */
        .ambient-glow {
          position: absolute;
          width: 80%;
          height: 80%;
          background: radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%);
          filter: blur(40px);
          animation: ambientPulse 4s ease-in-out infinite;
        }
        
        .ambient-glow-2 {
          position: absolute;
          width: 60%;
          height: 60%;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%);
          filter: blur(50px);
          animation: ambientPulse 4s ease-in-out infinite reverse;
        }
        
        @keyframes ambientPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
        
        /* Outermost decorative ring */
        .outermost-ring {
          position: absolute;
          width: 98%;
          height: 98%;
          border-radius: 50%;
          animation: rotateReverse 60s linear infinite;
        }
        
        .ring-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 4px;
          height: 4px;
          background: rgba(0, 212, 255, 0.5);
          border-radius: 50%;
          transform: rotate(calc(var(--i) * 10deg)) translateX(calc(min(175px, 24vw)));
          animation: dotPulse 2s ease-in-out infinite;
          animation-delay: calc(var(--i) * 0.1s);
        }
        
        @keyframes dotPulse {
          0%, 100% { opacity: 0.3; transform: rotate(calc(var(--i) * 10deg)) translateX(calc(min(175px, 24vw))) scale(1); }
          50% { opacity: 1; transform: rotate(calc(var(--i) * 10deg)) translateX(calc(min(175px, 24vw))) scale(1.5); }
        }
        
        @keyframes rotateReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        /* Outer rotating ring */
        .outer-ring {
          position: absolute;
          width: 90%;
          height: 90%;
          border: 2px solid rgba(0, 212, 255, 0.2);
          border-radius: 50%;
          animation: rotateRing 25s linear infinite;
        }
        
        .ring-marker {
          position: absolute;
          top: -6px;
          left: 50%;
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, #00d4ff, #a855f7);
          border-radius: 50%;
          box-shadow: 0 0 20px #00d4ff, 0 0 40px rgba(0, 212, 255, 0.5);
          animation: markerPulse 1.5s ease-in-out infinite;
        }
        
        .ring-marker-2 {
          top: auto;
          bottom: -6px;
          background: linear-gradient(135deg, #a855f7, #10b981);
          box-shadow: 0 0 20px #a855f7, 0 0 40px rgba(168, 85, 247, 0.5);
          animation-delay: 0.75s;
        }
        
        @keyframes rotateRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes markerPulse {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.3); }
        }
        
        /* Pulse waves */
        .pulse-wave {
          position: absolute;
          width: 40%;
          height: 40%;
          border: 2px solid rgba(0, 212, 255, 0.4);
          border-radius: 50%;
          opacity: 0;
          transform: scale(0.5);
        }
        
        .pulse-wave.active {
          animation: pulseExpand 2s ease-out forwards;
        }
        
        @keyframes pulseExpand {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        
        /* Middle ring */
        .middle-ring {
          position: absolute;
          width: 70%;
          height: 70%;
          border: 3px solid transparent;
          border-radius: 50%;
          background: linear-gradient(var(--bg), var(--bg)) padding-box,
                      linear-gradient(135deg, #a855f7, #00d4ff, #10b981) border-box;
          animation: rotateReverse 35s linear infinite;
        }
        
        .middle-ring-inner {
          position: absolute;
          inset: 8px;
          border: 1px dashed rgba(168, 85, 247, 0.3);
          border-radius: 50%;
          animation: rotateRing 20s linear infinite;
        }
        
        /* Data flow ring */
        .data-flow-ring {
          position: absolute;
          width: 55%;
          height: 55%;
          animation: rotateRing 15s linear infinite;
        }
        
        .data-particle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 6px;
          height: 6px;
          background: linear-gradient(135deg, #00d4ff, #a855f7);
          border-radius: 50%;
          transform: rotate(calc(var(--i) * 30deg)) translateX(calc(min(98px, 13.5vw)));
          box-shadow: 0 0 10px #00d4ff;
          animation: dataFlow 2s ease-in-out infinite;
          animation-delay: calc(var(--i) * 0.15s);
        }
        
        @keyframes dataFlow {
          0%, 100% { opacity: 0.4; transform: rotate(calc(var(--i) * 30deg)) translateX(calc(min(98px, 13.5vw))) scale(0.8); }
          50% { opacity: 1; transform: rotate(calc(var(--i) * 30deg)) translateX(calc(min(98px, 13.5vw))) scale(1.2); }
        }
        
        /* Inner core */
        .inner-core {
          position: absolute;
          width: 35%;
          height: 35%;
          background: linear-gradient(135deg, rgba(10, 10, 20, 0.95), rgba(20, 20, 40, 0.9));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 0 60px rgba(0, 212, 255, 0.4),
            0 0 100px rgba(168, 85, 247, 0.3),
            inset 0 0 40px rgba(0, 212, 255, 0.15);
          overflow: hidden;
        }
        
        .holographic-layer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(0, 212, 255, 0.1) 50%,
            transparent 70%
          );
          animation: holographicSweep 3s linear infinite;
        }
        
        @keyframes holographicSweep {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }
        
        .core-content {
          text-align: center;
          position: relative;
          z-index: 2;
        }
        
        .core-icon {
          position: relative;
          font-size: 32px;
          margin-bottom: 8px;
        }
        
        .icon-main {
          animation: iconFloat 2s ease-in-out infinite;
          display: inline-block;
        }
        
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.1); }
        }
        
        .icon-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 50px;
          height: 50px;
          border: 2px solid rgba(0, 212, 255, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: iconRingPulse 2s ease-in-out infinite;
        }
        
        @keyframes iconRingPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0; }
        }
        
        .core-text {
          font-family: var(--sans);
          font-size: 18px;
          font-weight: 800;
          background: linear-gradient(135deg, #00d4ff, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 0.05em;
        }
        
        .core-subtext {
          font-family: var(--mono);
          font-size: 9px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-top: 4px;
        }
        
        /* Orbit items */
        .orbit-item {
          position: absolute;
          top: 50%;
          left: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .inner-orbit {
          transform: rotate(var(--angle)) translateX(calc(min(120px, 16vw))) rotate(calc(-1 * var(--angle)));
        }
        
        .outer-orbit {
          transform: rotate(var(--angle)) translateX(calc(min(170px, 23vw))) rotate(calc(-1 * var(--angle)));
        }
        
        .orbit-item.active {
          z-index: 10;
        }
        
        .inner-orbit.active {
          transform: rotate(var(--angle)) translateX(calc(min(120px, 16vw))) rotate(calc(-1 * var(--angle))) scale(1.25);
        }
        
        .outer-orbit.active {
          transform: rotate(var(--angle)) translateX(calc(min(170px, 23vw))) rotate(calc(-1 * var(--angle))) scale(1.25);
        }
        
        .orbit-glow {
          position: absolute;
          width: 60px;
          height: 60px;
          background: radial-gradient(circle, var(--color) 0%, transparent 70%);
          opacity: 0;
          filter: blur(15px);
          transition: opacity 0.4s ease;
        }
        
        .orbit-item.active .orbit-glow {
          opacity: 0.6;
        }
        
        .orbit-icon {
          width: 46px;
          height: 46px;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 20, 35, 0.95));
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          transition: all 0.4s ease;
          position: relative;
          z-index: 2;
        }
        
        .orbit-item.active .orbit-icon {
          border-color: var(--color);
          box-shadow: 0 0 30px var(--color), 0 4px 20px rgba(0, 0, 0, 0.5);
          transform: rotate(360deg);
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .orbit-label {
          font-family: var(--mono);
          font-size: 9px;
          font-weight: 600;
          color: var(--muted);
          margin-top: 6px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.6;
          transition: all 0.3s ease;
        }
        
        .orbit-item.active .orbit-label {
          color: var(--color);
          opacity: 1;
          text-shadow: 0 0 10px var(--color);
        }
        
        .orbit-pulse {
          position: absolute;
          width: 60px;
          height: 60px;
          border: 2px solid var(--color);
          border-radius: 14px;
          animation: orbitPulseAnim 1s ease-out infinite;
        }
        
        @keyframes orbitPulseAnim {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        
        /* Floating code snippets */
        .floating-code {
          position: absolute;
          padding: 6px 12px;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          font-family: var(--mono);
          font-size: 10px;
          backdrop-filter: blur(10px);
          opacity: 0.7;
          animation: codeFloat 8s ease-in-out infinite;
        }
        
        .code-1 { top: 5%; left: 10%; animation-delay: 0s; }
        .code-2 { top: 80%; right: 5%; animation-delay: 2s; }
        .code-3 { bottom: 10%; left: 5%; animation-delay: 4s; }
        
        .code-bracket { color: #a855f7; }
        .code-key { color: #00d4ff; }
        .code-cmd { color: #10b981; }
        
        @keyframes codeFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
          25% { transform: translateY(-10px) rotate(2deg); opacity: 0.9; }
          50% { transform: translateY(-5px) rotate(-1deg); opacity: 0.6; }
          75% { transform: translateY(-15px) rotate(1deg); opacity: 0.8; }
        }
        
        /* Floating particles */
        .floating-particle {
          position: absolute;
          left: var(--x);
          top: var(--y);
          width: var(--size);
          height: var(--size);
          background: hsl(var(--hue), 80%, 60%);
          border-radius: 50%;
          opacity: 0.6;
          animation: particleFloat var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
          box-shadow: 0 0 10px hsl(var(--hue), 80%, 60%);
        }
        
        @keyframes particleFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(15px, -20px) scale(1.3); }
          50% { transform: translate(-10px, -35px) scale(0.8); }
          75% { transform: translate(-20px, -15px) scale(1.1); }
        }
        
        /* Connection lines */
        .connection-lines {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .conn-path {
          fill: none;
          stroke-width: 1.5;
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          filter: url(#lineGlow);
          animation: drawPath 2s ease forwards, pathPulse 3s ease-in-out infinite 2s;
          animation-delay: var(--delay, 0s);
        }
        
        @keyframes drawPath {
          to { stroke-dashoffset: 0; }
        }
        
        @keyframes pathPulse {
          0%, 100% { opacity: 0.5; stroke-width: 1.5; }
          50% { opacity: 0.9; stroke-width: 2; }
        }
        
        /* Scanning line */
        .scan-line {
          position: absolute;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.5), transparent);
          top: 50%;
          animation: scanMove 4s ease-in-out infinite;
          pointer-events: none;
        }
        
        @keyframes scanMove {
          0% { transform: translateY(-150px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          50% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(150px) rotate(0deg); opacity: 0; }
        }
        
        .hero-cta-primary:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 10px 40px rgba(0, 212, 255, 0.4) !important;
        }
        
        .hero-cta-secondary:hover {
          transform: translateY(-3px) !important;
          border-color: var(--accent) !important;
          box-shadow: 0 10px 40px rgba(0, 212, 255, 0.2) !important;
        }
        
        @media (max-width: 900px) {
          .devops-visual-container {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
