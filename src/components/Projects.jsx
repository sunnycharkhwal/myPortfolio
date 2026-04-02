import { useRef, useState, useEffect } from 'react'
import { PROJECTS } from '../data/index.js'
import useFadeIn from '../hooks/useFadeIn.js'
import { 
  FaRocket, FaCloud, FaShieldAlt, FaDatabase, FaExclamationTriangle,
  FaCubes, FaDollarSign, FaServer, FaLayerGroup
} from 'react-icons/fa'
import { SiTerraform, SiKubernetes, SiPrometheus } from 'react-icons/si'
import { HiViewGrid } from 'react-icons/hi'

const catClass = {
  cicd:'cat-cicd', iac:'cat-iac', k8s:'cat-k8s', cloud:'cat-cloud',
  mon:'cat-mon', sec:'cat-sec', inc:'cat-inc', db:'cat-db',
  mesh:'cat-mesh', fin:'cat-fin', dr:'cat-dr', mod:'cat-mod'
}

const categories = [
  { id: 'all', label: 'All Projects', icon: HiViewGrid, color: '#00d4ff' },
  { id: 'cicd', label: 'CI/CD', icon: FaRocket, color: '#00d4ff' },
  { id: 'iac', label: 'IaC', icon: SiTerraform, color: '#7B42BC' },
  { id: 'k8s', label: 'Containers', icon: SiKubernetes, color: '#326CE5' },
  { id: 'cloud', label: 'Cloud', icon: FaCloud, color: '#FF9900' },
  { id: 'mon', label: 'Monitoring', icon: SiPrometheus, color: '#E6522C' },
  { id: 'sec', label: 'Security', icon: FaShieldAlt, color: '#ff6b6b' },
  { id: 'inc', label: 'Incident', icon: FaExclamationTriangle, color: '#fbbf24' },
  { id: 'db', label: 'Database', icon: FaDatabase, color: '#a855f7' },
  { id: 'mesh', label: 'Microservices', icon: FaCubes, color: '#10b981' },
  { id: 'fin', label: 'FinOps', icon: FaDollarSign, color: '#22c55e' },
  { id: 'dr', label: 'DR', icon: FaServer, color: '#f97316' },
  { id: 'mod', label: 'Modernization', icon: FaLayerGroup, color: '#06b6d4' },
]

function ProjectModal({ project, onClose }) {
  const [isClosing, setIsClosing] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    

    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight
    

    document.documentElement.style.setProperty('--scrollbar-compensation', `${scrollbarWidth}px`)
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollbarWidth}px`
    

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true)
      })
    })
    
    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
      document.documentElement.style.removeProperty('--scrollbar-compensation')
    }
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 380)
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <div 
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',

        background: isClosing 
          ? 'rgba(0, 0, 0, 0)' 
          : (isVisible ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0)'),
        backdropFilter: isClosing 
          ? 'blur(0px)' 
          : (isVisible ? 'blur(20px) saturate(180%)' : 'blur(0px)'),
        WebkitBackdropFilter: isClosing 
          ? 'blur(0px)' 
          : (isVisible ? 'blur(20px) saturate(180%)' : 'blur(0px)'),
        transition: 'all 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
      }}
    >
      
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 212, 255, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 100% 100%, rgba(168, 85, 247, 0.06) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 0% 100%, rgba(16, 185, 129, 0.04) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
        opacity: isClosing ? 0 : (isVisible ? 1 : 0),
        transition: 'opacity 0.4s ease',
      }} />

      <div style={{
        background: 'linear-gradient(180deg, rgba(25, 25, 35, 0.98) 0%, rgba(15, 15, 22, 0.99) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 24,
        maxWidth: 850,
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: `
          0 0 0 1px rgba(255, 255, 255, 0.05) inset,
          0 50px 100px -20px rgba(0, 0, 0, 0.8),
          0 30px 60px -30px rgba(0, 0, 0, 0.6),
          0 0 80px rgba(0, 212, 255, 0.08)
        `,
        transform: isClosing 
          ? 'scale(0.92) translateY(30px)' 
          : (isVisible ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(-30px)'),
        opacity: isClosing ? 0 : (isVisible ? 1 : 0),
        transition: 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.4s ease',
      }}>
        
        <div style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.5), rgba(168, 85, 247, 0.5), transparent)',
          borderRadius: '24px 24px 0 0',
        }} />
        
        
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border)',
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)'
            e.currentTarget.style.borderColor = 'var(--accent)'
            e.currentTarget.querySelector('svg').style.stroke = 'var(--accent)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.querySelector('svg').style.stroke = 'var(--text-secondary)'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" style={{ transition: 'stroke 0.3s' }}>
            <path d="M5 5L15 15M15 5L5 15" />
          </svg>
        </button>

        
        <div style={{ padding: '2.5rem 2.5rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
            <span style={{
              background: 'rgba(0, 212, 255, 0.1)',
              color: 'var(--accent)',
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '5px 12px',
              borderRadius: 8,
              border: '1px solid rgba(0, 212, 255, 0.2)',
            }}>
              #{String(project.id).padStart(2, '0')}
            </span>
            <span 
              className={catClass[project.category]}
              style={{
                fontSize: '0.8rem',
                padding: '5px 12px',
                borderRadius: 8,
                fontWeight: 600,
              }}
            >
              {project.catLabel}
            </span>
          </div>
          <h2 style={{
            fontSize: '1.6rem',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '0.6rem',
            lineHeight: 1.35,
          }}>
            {project.title}
          </h2>
          <p style={{
            fontSize: '1rem',
            color: 'var(--text-secondary)',
          }}>
            {project.subtitle}
          </p>
        </div>

        <hr style={{ 
          border: 'none', 
          borderTop: '1px solid var(--border)', 
          margin: '0 2.5rem' 
        }} />

        
        <div style={{ padding: '1.75rem 2.5rem 2.5rem' }}>
          
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            background: 'var(--gradient-1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.75rem',
          }}>
            Objective
          </div>
          <div style={{
            background: 'rgba(0, 212, 255, 0.03)',
            borderLeft: '3px solid var(--accent)',
            borderRadius: '0 10px 10px 0',
            padding: '1rem 1.25rem',
            fontSize: '0.98rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
            lineHeight: 1.6,
          }}>
            {project.objective}
          </div>

          
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            background: 'var(--gradient-1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.75rem',
          }}>
            Architecture & Steps
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: '2rem' }}>
            {project.steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{
                  minWidth: 32,
                  height: 32,
                  background: 'rgba(0, 212, 255, 0.1)',
                  border: '1px solid rgba(0, 212, 255, 0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '0.95rem',
                  lineHeight: 1.65,
                  paddingTop: 4,
                }} dangerouslySetInnerHTML={{ __html: `<strong style="color: var(--text)">${step.title}:</strong> ${step.text}` }} />
              </div>
            ))}
          </div>

          
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            background: 'linear-gradient(135deg, #FF9900 0%, #FFB84D 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.75rem',
          }}>
            AWS Services Used
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: '2rem' }}>
            {project.aws.map((service, i) => (
              <span key={i} style={{
                background: 'rgba(255, 153, 0, 0.1)',
                border: '1px solid rgba(255, 153, 0, 0.25)',
                borderRadius: 10,
                fontSize: '0.85rem',
                padding: '6px 14px',
                color: '#FF9900',
                fontWeight: 500,
              }}>
                {service}
              </span>
            ))}
          </div>

          
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            background: 'linear-gradient(135deg, var(--accent-green) 0%, #34d399 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.75rem',
          }}>
            Key Outcomes
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 0 }}>
            {project.outcomes.map((outcome, i) => (
              <li key={i} style={{
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                paddingLeft: '1.75rem',
                position: 'relative',
                lineHeight: 1.65,
              }}>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  color: 'var(--accent-green)',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  textShadow: '0 0 10px var(--accent-green)',
                }}>✓</span>
                {outcome}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, onOpenModal }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      onClick={() => onOpenModal(project)}
      style={{ 
        background: 'linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%)',
        border: isHovered ? '1px solid rgba(0, 212, 255, 0.4)' : '1px solid var(--border)',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'none',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 212, 255, 0.15)' 
          : '0 4px 20px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: 'var(--gradient-1)',
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.4s',
      }} />

      
      <div style={{ padding: '1.4rem 1.5rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
          <span style={{
            background: 'rgba(0, 212, 255, 0.1)',
            color: 'var(--accent)',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 6,
            border: '1px solid rgba(0, 212, 255, 0.2)',
          }}>
            #{String(project.id).padStart(2, '0')}
          </span>
          <span 
            className={catClass[project.category]}
            style={{
              fontSize: '0.75rem',
              padding: '4px 10px',
              borderRadius: 6,
              fontWeight: 600,
            }}
          >
            {project.catLabel}
          </span>
        </div>
        <div style={{
          fontSize: '1.1rem',
          fontWeight: 600,
          color: 'var(--text)',
          marginBottom: '0.4rem',
          lineHeight: 1.4,
        }}>
          {project.title}
        </div>
        <div style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
        }}>
          {project.subtitle}
        </div>
      </div>

      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.9rem 1.5rem',
        borderTop: '1px solid var(--border)',
        marginTop: 'auto',
        background: isHovered ? 'rgba(0, 212, 255, 0.03)' : 'transparent',
        transition: 'background 0.4s',
      }}>
        <span style={{ 
          fontSize: '0.8rem', 
          color: isHovered ? 'var(--accent)' : 'var(--muted)',
          transition: 'color 0.3s',
        }}>
          View details
        </span>
        <svg 
          style={{
            width: 18,
            height: 18,
            color: 'var(--accent)',
            transition: 'transform 0.3s',
            transform: isHovered ? 'translateX(6px)' : 'none',
            filter: isHovered ? 'drop-shadow(0 0 8px var(--accent))' : 'none',
          }}
          viewBox="0 0 16 16" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="6 4 10 8 6 12"/>
        </svg>
      </div>
    </div>
  )
}

export default function Projects() {
  const ref = useRef()
  const gridRef = useRef()
  const [filter, setFilter] = useState('all')
  const [selectedProject, setSelectedProject] = useState(null)
  useFadeIn(ref)

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    if (gridRef.current) {
      gridRef.current.scrollTop = 0
    }
    window.scrollTo({
      top: document.getElementById('projects').offsetTop + 150,
      behavior: 'smooth'
    })
  }

  const filteredProjects = filter === 'all' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === filter)

  return (
    <>
      
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}

      <section id="projects" ref={ref} style={{ 
        background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%)',
        padding: '0',
        minHeight: '100vh',
        position: 'relative',
      }}>
        
        <div style={{
          background: 'linear-gradient(135deg, var(--bg2) 0%, var(--bg) 100%)',
          borderBottom: '1px solid var(--border)',
          padding: '3rem 2rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            height: 300,
            background: 'radial-gradient(ellipse, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          
          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '0.75rem',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}>
            
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              background: 'linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(168,85,247,0.15) 100%)',
              border: '2px solid rgba(0,212,255,0.4)',
              borderRadius: 12,
              fontFamily: 'var(--mono)',
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--accent)',
              boxShadow: '0 0 30px rgba(0,212,255,0.2)',
              animation: 'numberPulse 3s ease-in-out infinite',
            }}>
              13
            </span>
            
            
            <span style={{
              background: 'linear-gradient(90deg, var(--text) 0%, var(--text-secondary) 50%, var(--text) 100%)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'titleShimmer 4s ease-in-out infinite',
            }}>
              Real-World DevOps
            </span>
            
            
            <span style={{
              position: 'relative',
              color: 'var(--text)',
            }}>
              Projects
              <span style={{
                position: 'absolute',
                bottom: -4,
                left: 0,
                width: '100%',
                height: 3,
                background: 'var(--gradient-1)',
                borderRadius: 2,
                animation: 'underlineGrow 2s ease-out forwards',
              }} />
            </span>
            
            
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'linear-gradient(135deg, #FF9900 0%, #FFB84D 100%)',
              color: '#000',
              fontWeight: 700,
              fontSize: '0.75rem',
              padding: '6px 14px',
              borderRadius: 8,
              boxShadow: '0 4px 20px rgba(255, 153, 0, 0.35)',
              animation: 'floatBadge 3s ease-in-out infinite',
              letterSpacing: '0.05em',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
              AWS
            </span>
          </h1>
          
          
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.05rem',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            flexWrap: 'wrap',
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 20,
              fontSize: '0.85rem',
              color: '#10b981',
              fontFamily: 'var(--mono)',
            }}>
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#10b981',
                animation: 'statusBlink 2s ease-in-out infinite',
              }} />
              Production-grade
            </span>
            <span style={{ color: 'var(--muted)' }}>•</span>
            <span>Click any card to explore architecture</span>
            <span style={{
              display: 'inline-block',
              animation: 'bounceArrow 1.5s ease-in-out infinite',
            }}>
              👇
            </span>
          </p>
          
          
          <style>{`
            @keyframes numberPulse {
              0%, 100% { 
                box-shadow: 0 0 30px rgba(0,212,255,0.2);
                transform: scale(1);
              }
              50% { 
                box-shadow: 0 0 40px rgba(0,212,255,0.4);
                transform: scale(1.05);
              }
            }
            
            @keyframes titleShimmer {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
            
            @keyframes underlineGrow {
              0% { transform: scaleX(0); transform-origin: left; }
              100% { transform: scaleX(1); transform-origin: left; }
            }
            
            @keyframes floatBadge {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-4px); }
            }
            
            @keyframes statusBlink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            
            @keyframes bounceArrow {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(4px); }
            }
          `}</style>
        </div>

        
        <div 
          className="hide-scrollbar"
          style={{
            padding: '1rem 0',
            background: 'linear-gradient(180deg, rgba(18, 18, 26, 0.8) 0%, rgba(18, 18, 26, 0.6) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 72,
            zIndex: 10,
            overflowX: 'auto',
            overflowY: 'hidden',
            WebkitOverflowScrolling: 'touch',
          }}>
          
          <div style={{
            display: 'flex',
            gap: 8,
            padding: '0 1.5rem',
            minWidth: 'max-content',
          }}>
            {categories.map(cat => {
              const Icon = cat.icon
              const isActive = filter === cat.id
              const count = cat.id === 'all' 
                ? PROJECTS.length 
                : PROJECTS.filter(p => p.category === cat.id).length
              
              return (
                <button
                  key={cat.id}
                  onClick={() => handleFilterChange(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: isActive 
                      ? `linear-gradient(135deg, ${cat.color}20 0%, ${cat.color}10 100%)`
                      : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isActive ? cat.color + '60' : 'rgba(255,255,255,0.06)'}`,
                    color: isActive ? cat.color : 'var(--text-secondary)',
                    padding: '8px 14px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? 600 : 500,
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontFamily: 'var(--sans)',
                    boxShadow: isActive 
                      ? `0 4px 20px ${cat.color}25, inset 0 1px 0 ${cat.color}20`
                      : 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = cat.color + '40'
                      e.currentTarget.style.color = cat.color
                      e.currentTarget.style.background = `${cat.color}10`
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                      e.currentTarget.style.color = 'var(--text-secondary)'
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }
                  }}
                >
                  <Icon style={{ 
                    fontSize: 14,
                    opacity: isActive ? 1 : 0.7,
                  }} />
                  <span>{cat.label}</span>
                  {count > 0 && (
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: 6,
                      background: isActive ? cat.color + '30' : 'rgba(255,255,255,0.08)',
                      color: isActive ? cat.color : 'var(--muted)',
                      fontFamily: 'var(--mono)',
                    }}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        
        <div ref={gridRef} style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', 
          gap: 'clamp(1rem, 2vw, 1.5rem)',
          padding: 'clamp(1rem, 3vw, 2rem)',
          maxWidth: 1400,
          margin: '0 auto',
        }}>
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onOpenModal={setSelectedProject}
            />
          ))}
        </div>

        
        <div style={{
          textAlign: 'center',
          padding: '2.5rem',
          color: 'var(--muted)',
          fontSize: '0.85rem',
          borderTop: '1px solid var(--border)',
          background: 'linear-gradient(180deg, transparent 0%, rgba(0, 212, 255, 0.02) 100%)',
        }}>
          All projects utilize real AWS services designed for production-grade environments.
        </div>
      </section>
    </>
  )
}
