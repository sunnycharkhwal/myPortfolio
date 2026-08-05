import { useRef, useEffect, useState } from 'react'
import { FaGraduationCap } from 'react-icons/fa'
import { EXPERIENCE, EXPERIENCE_ACHIEVEMENTS, EDUCATION } from '../data/index.js'
import SectionHeader from './SectionHeader.jsx'
import useFadeIn from '../hooks/useFadeIn.js'

const ACCENTS = ['#00d4ff', '#a855f7', '#10b981', '#f97316']

function ExperienceCard({ entry, index, isVisible }) {
  const [expanded, setExpanded] = useState(false)
  const collapsedCount = 2
  const hasMore = entry.points.length > collapsedCount
  const visiblePoints = expanded ? entry.points : entry.points.slice(0, collapsedCount)
  const accent = ACCENTS[index % ACCENTS.length]

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      gap: 'clamp(0.85rem, 3vw, 1.5rem)',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
      transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + index * 0.15}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + index * 0.15}s`,
    }}>
      {/* timeline node */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 30 }}>
        <div style={{
          position: 'relative',
          width: 14,
          height: 14,
          borderRadius: '50%',
          marginTop: 10,
          background: entry.current ? accent : 'var(--bg2)',
          border: `2px solid ${accent}`,
          boxShadow: entry.current ? `0 0 16px ${accent}` : 'none',
          zIndex: 2,
        }}>
          {entry.current && <span className="exp-node-ping" style={{ borderColor: accent, color: accent }} />}
        </div>
      </div>

      {/* card */}
      <div
        className="exp-card"
        style={{
          '--exp-accent': accent,
          flex: 1,
          minWidth: 0,
          background: 'linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%)',
          border: '1px solid var(--border)',
          borderRadius: 18,
          padding: 'clamp(1.15rem, 3vw, 1.6rem)',
          marginBottom: 'clamp(1.25rem, 4vw, 2rem)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: '0.65rem' }}>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
            color: accent, textTransform: 'uppercase', letterSpacing: '0.08em',
            background: `${accent}18`, border: `1px solid ${accent}40`,
            padding: '4px 12px', borderRadius: 50,
          }}>
            {entry.period}
          </span>
          {entry.current && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
              color: 'var(--accent-green)', textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--accent-green)', boxShadow: '0 0 8px var(--accent-green)',
                animation: 'pulse 2s ease-in-out infinite',
              }} />
              Current
            </span>
          )}
        </div>

        <h3 style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.3rem)', fontWeight: 800, color: 'var(--text)', marginBottom: 4, lineHeight: 1.25 }}>
          {entry.title}
        </h3>
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: '0.9rem', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ color: accent, fontWeight: 600 }}>{entry.company}</span>
          <span style={{ color: 'var(--muted)' }}>·</span>
          <span>{entry.location}</span>
        </p>

        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7, marginBottom: '0.85rem' }}>
          {visiblePoints.map((point, i) => (
            <li key={i} style={{ display: 'flex', gap: 9, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <span style={{ color: accent, flexShrink: 0 }}>▸</span>
              {point}
            </li>
          ))}
        </ul>

        {hasMore && (
          <button
            className="exp-toggle"
            onClick={() => setExpanded((e) => !e)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--mono)', fontSize: 11.5, fontWeight: 600,
              color: 'var(--muted)', padding: 0, marginBottom: '1rem',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {expanded ? 'Show less' : `+${entry.points.length - collapsedCount} more`}
            <span style={{
              display: 'inline-flex',
              transform: expanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.3s ease',
            }}>▾</span>
          </button>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {entry.tech.map((t) => (
            <div key={t.name} className="exp-tech-chip" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 10px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8,
            }}>
              <t.Icon style={{ fontSize: 13, color: t.color }} />
              <span style={{ fontSize: 11.5, color: 'var(--text-secondary)', fontWeight: 500 }}>{t.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Experience() {
  const ref = useRef()
  const [isVisible, setIsVisible] = useState(false)
  useFadeIn(ref)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
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
        marginBottom: 'clamp(2.5rem, 6vw, 3.5rem)',
      }}>
        {EXPERIENCE_ACHIEVEMENTS.map((ach, i) => (
          <div
            key={ach.label}
            style={{
              background: 'rgba(18, 18, 26, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 16,
              padding: '1.25rem 1rem',
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
              fontSize: 22,
              color: ach.color,
              marginBottom: '0.65rem',
              filter: `drop-shadow(0 0 10px ${ach.color}50)`,
            }} />
            <div style={{
              fontSize: 'clamp(1.35rem, 3vw, 1.75rem)',
              fontWeight: 800,
              fontFamily: 'var(--mono)',
              background: `linear-gradient(135deg, ${ach.color}, ${ach.color}aa)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.2rem',
            }}>
              {ach.value}
            </div>
            <div style={{
              fontSize: 11,
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {ach.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
        <div style={{
          position: 'absolute',
          left: 14,
          top: 10,
          bottom: 10,
          width: 2,
          background: 'linear-gradient(180deg, var(--accent) 0%, var(--accent-purple) 50%, var(--accent-green) 100%)',
          opacity: 0.4,
          transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
          transformOrigin: 'top',
          transition: 'transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
        }} />

        {EXPERIENCE.map((entry, i) => (
          <ExperienceCard key={entry.id} entry={entry} index={i} isVisible={isVisible} />
        ))}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        marginTop: '1rem',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.6s ease 1s',
      }}>
        <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, var(--border))' }} />
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)',
          textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>
          Career Journey
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {EXPERIENCE.map((entry, i) => (
            <div
              key={entry.id}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: entry.current ? 'var(--accent)' : 'rgba(255, 255, 255, 0.1)',
                boxShadow: entry.current ? '0 0 10px var(--accent)' : 'none',
                animation: entry.current ? 'pulse 2s ease-in-out infinite' : 'none',
              }}
            />
          ))}
        </div>
        <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, var(--border), transparent)' }} />
      </div>

      <div style={{
        maxWidth: 760,
        margin: 'clamp(2.5rem, 6vw, 3.5rem) auto 0',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease 0.5s',
      }}>
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
          Education
        </h4>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: '0.9rem',
        }}>
          {EDUCATION.map((edu) => (
            <div key={edu.id} className="exp-card" style={{
              '--exp-accent': '#a855f7',
              display: 'flex',
              gap: 14,
              background: 'rgba(18, 18, 26, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 14,
              padding: '1.1rem 1.25rem',
            }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                flexShrink: 0,
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <FaGraduationCap style={{ fontSize: 16, color: 'var(--accent-purple)' }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)', marginBottom: 2, lineHeight: 1.35 }}>
                  {edu.degree}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  {edu.field}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {edu.institution} · {edu.location}
                </div>
                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--accent-purple)', marginTop: 4 }}>
                  {edu.period}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
