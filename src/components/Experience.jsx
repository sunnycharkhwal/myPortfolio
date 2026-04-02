import { useRef, useEffect, useState } from 'react'
import { EXPERIENCE } from '../data/index.js'
import SectionHeader from './SectionHeader.jsx'
import useFadeIn from '../hooks/useFadeIn.js'
import { 
  SiReact, SiNextdotjs, SiJavascript, SiTypescript,
  SiTailwindcss, SiGit, SiWebpack, SiFigma
} from 'react-icons/si'
import { FaCode, FaRocket, FaUsers, FaChartLine } from 'react-icons/fa'

const techStack = [
  { Icon: SiReact, name: 'React', color: '#61DAFB' },
  { Icon: SiNextdotjs, name: 'Next.js', color: '#ffffff' },
  { Icon: SiJavascript, name: 'JavaScript', color: '#F7DF1E' },
  { Icon: SiTypescript, name: 'TypeScript', color: '#3178C6' },
  { Icon: SiTailwindcss, name: 'Tailwind', color: '#06B6D4' },
  { Icon: SiGit, name: 'Git', color: '#F05032' },
  { Icon: SiWebpack, name: 'Webpack', color: '#8DD6F9' },
  { Icon: SiFigma, name: 'Figma', color: '#F24E1E' },
]

const achievements = [
  { icon: FaCode, value: '30+', label: 'Projects Delivered', color: '#00d4ff' },
  { icon: FaRocket, value: '30%', label: 'Performance Boost', color: '#a855f7' },
  { icon: FaUsers, value: '5+', label: 'Team Members Led', color: '#10b981' },
  { icon: FaChartLine, value: '2.5+', label: 'Years Experience', color: '#f97316' },
]

export default function Experience() {
  const ref = useRef()
  const [isVisible, setIsVisible] = useState(false)
  const [activePoint, setActivePoint] = useState(null)
  useFadeIn(ref)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="experience" ref={ref} className="sc-section" style={{ overflow: 'hidden' }}>
      <SectionHeader num="03" title="Experience" />

      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '1rem',
        marginBottom: '2.5rem',
      }}>
        {achievements.map((ach, i) => (
          <div
            key={ach.label}
            style={{
              background: 'rgba(18, 18, 26, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 16,
              padding: '1.5rem 1rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: `all 0.6s ease ${i * 0.1}s`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.borderColor = `${ach.color}40`
              e.currentTarget.style.boxShadow = `0 20px 40px -15px ${ach.color}30`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <ach.icon style={{ 
              fontSize: 24, 
              color: ach.color,
              marginBottom: '0.75rem',
              filter: `drop-shadow(0 0 10px ${ach.color}50)`,
            }} />
            <div style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 800,
              fontFamily: 'var(--mono)',
              background: `linear-gradient(135deg, ${ach.color}, ${ach.color}aa)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.25rem',
            }}>
              {ach.value}
            </div>
            <div style={{
              fontSize: 12,
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {ach.label}
            </div>
          </div>
        ))}
      </div>

      
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(18, 18, 26, 0.9) 0%, rgba(12, 12, 18, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 28,
        padding: 'clamp(1.5rem, 4vw, 3rem)',
        overflow: 'hidden',
        boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.5)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'all 0.7s ease 0.3s',
      }}>
        
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-30%',
          width: '80%',
          height: '150%',
          background: `
            radial-gradient(circle at center, rgba(0, 212, 255, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 50% 100%, rgba(168, 85, 247, 0.06) 0%, transparent 40%)
          `,
          animation: isVisible ? 'gradientShift 20s ease infinite' : 'none',
          pointerEvents: 'none',
        }} />

        
        <div style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.5), rgba(168, 85, 247, 0.5), transparent)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            alignItems: 'flex-start',
            marginBottom: '2rem',
          }}>
            
            <div style={{
              width: 70,
              height: 70,
              borderRadius: 18,
              background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(168, 85, 247, 0.1))',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              flexShrink: 0,
              boxShadow: '0 0 30px rgba(0, 212, 255, 0.15)',
            }}>
              💼
            </div>

            
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(0, 212, 255, 0.1)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                borderRadius: 50,
                padding: '6px 14px',
                marginBottom: '0.75rem',
              }}>
                <span style={{
                  width: 6, height: 6,
                  background: 'var(--accent-green)',
                  borderRadius: '50%',
                  boxShadow: '0 0 8px var(--accent-green)',
                }} />
                <span style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                }}>
                  {EXPERIENCE.period}
                </span>
              </div>
              
              <h3 style={{
                fontSize: 'clamp(1.3rem, 3vw, 1.75rem)',
                fontWeight: 800,
                color: 'var(--text)',
                marginBottom: '0.5rem',
                lineHeight: 1.2,
              }}>
                {EXPERIENCE.title}
              </h3>
              
              <p style={{
                fontSize: 15,
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
              }}>
                <span style={{ color: 'var(--accent-purple)' }}>{EXPERIENCE.company}</span>
                <span style={{ color: 'var(--muted)' }}>·</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {EXPERIENCE.location}
                </span>
              </p>
            </div>
          </div>

          
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{
              fontSize: 13,
              fontFamily: 'var(--mono)',
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{ color: 'var(--accent)' }}>▸</span>
              Key Responsibilities
            </h4>
            
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {EXPERIENCE.points.map((point, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 14,
                    padding: '1rem 1.25rem',
                    background: activePoint === i 
                      ? 'rgba(0, 212, 255, 0.08)' 
                      : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${activePoint === i ? 'rgba(0, 212, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)'}`,
                    borderRadius: 14,
                    cursor: 'default',
                    transition: 'all 0.3s ease',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
                    transitionDelay: `${0.5 + i * 0.1}s`,
                  }}
                  onMouseEnter={() => setActivePoint(i)}
                  onMouseLeave={() => setActivePoint(null)}
                >
                  <span style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: activePoint === i 
                      ? 'var(--gradient-1)' 
                      : 'rgba(0, 212, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: 12,
                    fontWeight: 700,
                    color: activePoint === i ? '#0a0a0f' : 'var(--accent)',
                    transition: 'all 0.3s ease',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{
                    fontSize: 15,
                    color: activePoint === i ? 'var(--text)' : 'var(--text-secondary)',
                    lineHeight: 1.7,
                    transition: 'color 0.3s ease',
                  }}>
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          
          <div>
            <h4 style={{
              fontSize: 13,
              fontFamily: 'var(--mono)',
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{ color: 'var(--accent-purple)' }}>▸</span>
              Technologies Used
            </h4>
            
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}>
              {techStack.map((tech, i) => (
                <div
                  key={tech.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 10,
                    cursor: 'default',
                    transition: 'all 0.3s ease',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: `${1 + i * 0.05}s`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${tech.color}15`
                    e.currentTarget.style.borderColor = `${tech.color}40`
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <tech.Icon style={{ 
                    fontSize: 16, 
                    color: tech.color,
                    filter: `drop-shadow(0 0 4px ${tech.color}50)`,
                  }} />
                  <span style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--text)',
                  }}>
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        
        <div style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          fontFamily: 'var(--mono)',
          fontSize: 11,
          color: 'var(--muted)',
          opacity: 0.4,
        }}>
          <span style={{ color: 'var(--accent-green)' }}>const</span> experience = <span style={{ color: 'var(--accent-purple)' }}>"valuable"</span>;
        </div>
      </div>

      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        marginTop: '2.5rem',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.6s ease 1.2s',
      }}>
        <div style={{
          width: 40,
          height: 1,
          background: 'linear-gradient(90deg, transparent, var(--border))',
        }} />
        <span style={{
          fontFamily: 'var(--mono)',
          fontSize: 12,
          color: 'var(--muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          Career Journey
        </span>
        <div style={{
          display: 'flex',
          gap: 6,
        }}>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: i === 0 ? 'var(--accent)' : 'rgba(255, 255, 255, 0.1)',
                boxShadow: i === 0 ? '0 0 10px var(--accent)' : 'none',
                animation: i === 0 ? 'pulse 2s ease-in-out infinite' : 'none',
              }}
            />
          ))}
        </div>
        <div style={{
          width: 40,
          height: 1,
          background: 'linear-gradient(90deg, var(--border), transparent)',
        }} />
      </div>
    </section>
  )
}
