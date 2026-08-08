import { useRef, useEffect, useState } from 'react'
import { listSkillCategories } from '../api/skillsApi.js'
import { getSkillsSection } from '../api/skillsSectionApi.js'
import { resolveIcon } from '../utils/iconRegistry.js'
import { sanitizeRichText } from '../utils/sanitizeRichText.js'
import SectionHeader from './SectionHeader.jsx'
import useFadeIn from '../hooks/useFadeIn.js'
import useSectionHeading from '../hooks/useSectionHeading.js'

// The card's top hairline / icon glow only ever needs one accent color per category —
// derived here from the admin-set `color` instead of a stored second "gradient" field,
// same single-color-field convention Projects.jsx's categoryBadgeStyle and Experience.jsx's
// achievement-value gradient already use.
function categoryGradient(color) {
  return `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`
}

// Fails open to this exact copy (not blank) both before the fetch resolves and if it
// ever fails — same "briefly the old hardcoded content beats briefly blank" precedent
// Hero.jsx's DEFAULT_HERO uses.
const DEFAULT_SECTION = {
  tagline:
    '<p>Technologies I use to build <span style="color: #00d4ff">scalable</span>, ' +
    '<span style="color: #a855f7">secure</span>, and ' +
    '<span style="color: #10b981">automated</span> infrastructure</p>',
  stats: [
    { value: '39', label: 'Technologies', color: 'var(--accent)' },
    { value: '8', label: 'Categories', color: 'var(--accent-purple)' },
    { value: '∞', label: 'Learning', color: 'var(--accent-green)' },
  ],
  footerCommand: 'skills --list --format=awesome',
}

export default function Skills() {
  const ref = useRef()
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [hoveredTag, setHoveredTag] = useState(null)
  useFadeIn(ref)

  // Public content fetched live from the database — no Redux for the data itself, same
  // self-contained fetch pattern as Experience.jsx/Projects.jsx. Fails open to an empty
  // array (categories) / DEFAULT_SECTION (copy) on error rather than crashing the page;
  // disabled categories/tags/stats are filtered out client-side, same `enabled !== false`
  // convention used everywhere else.
  const [rawCategories, setRawCategories] = useState([])
  const [section, setSection] = useState(DEFAULT_SECTION)
  const [loaded, setLoaded] = useState(false)
  const heading = useSectionHeading('skills', { num: '01', title: 'Tech Stack' })

  useEffect(() => {
    let cancelled = false
    Promise.all([listSkillCategories(), getSkillsSection()])
      .then(([categoriesData, sectionData]) => {
        if (cancelled) return
        setRawCategories(categoriesData)
        if (sectionData && Object.keys(sectionData).length > 0) {
          setSection((prev) => ({ ...prev, ...sectionData }))
        }
        setLoaded(true)
      })
      .catch(() => {
        if (!cancelled) setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const SKILLS = rawCategories
    .filter((c) => c.enabled !== false)
    .map((c) => ({
      title: c.title,
      icon: resolveIcon(c.iconKey),
      color: c.color,
      gradient: categoryGradient(c.color),
      tags: (c.tags || [])
        .filter((t) => t.enabled !== false)
        .map((t) => ({ name: t.name, icon: resolveIcon(t.iconKey) })),
    }))
  const visibleStats = (section.stats || []).filter((s) => s.enabled !== false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="skills" ref={ref} className="sc-section" style={{ overflow: 'hidden' }}>
      <SectionHeader num={heading.num} title={heading.title} />
      
      
      {/* A <div>, not a <p> — RichTextEditor.jsx (Tiptap) always wraps saved content in
          its own <p>, and a <p> can't validly contain another <p> once an admin edits
          this from the dashboard. Same container choice Hero.jsx's bio already makes. */}
      <div
        className="rich-content"
        style={{
          textAlign: 'center',
          maxWidth: 600,
          margin: '0 auto 3rem',
          color: 'var(--text-secondary)',
          fontSize: '1.1rem',
          lineHeight: 1.7,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease',
        }}
        dangerouslySetInnerHTML={{ __html: sanitizeRichText(section.tagline) }}
      />

      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: '1.5rem',
      }}>
        {!loaded ? (
          <p style={{ color: 'var(--text-secondary)', gridColumn: '1 / -1', textAlign: 'center' }}>Loading tech stack…</p>
        ) : SKILLS.map((skill, index) => (
          <div
            key={skill.title}
            style={{
              position: 'relative',
              background: hoveredCard === index 
                ? 'rgba(25, 25, 35, 0.9)' 
                : 'rgba(18, 18, 26, 0.6)',
              border: `1px solid ${hoveredCard === index ? `${skill.color}40` : 'rgba(255, 255, 255, 0.06)'}`,
              borderRadius: 24,
              padding: '2rem',
              overflow: 'hidden',
              cursor: 'default',
              opacity: isVisible ? 1 : 0,
              transform: isVisible 
                ? (hoveredCard === index ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)') 
                : 'translateY(40px) scale(0.95)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDelay: isVisible ? `${index * 0.08}s` : '0s',
              boxShadow: hoveredCard === index 
                ? `0 25px 50px -12px ${skill.color}30, 0 0 0 1px ${skill.color}20` 
                : '0 4px 20px rgba(0, 0, 0, 0.2)',
            }}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-50%',
              width: '100%',
              height: '100%',
              background: `radial-gradient(circle, ${skill.color}15 0%, transparent 70%)`,
              opacity: hoveredCard === index ? 1 : 0,
              transition: 'opacity 0.4s ease',
              pointerEvents: 'none',
            }} />

            
            <div style={{
              position: 'absolute',
              top: 0,
              left: hoveredCard === index ? '0%' : '50%',
              right: hoveredCard === index ? '0%' : '50%',
              height: 2,
              background: skill.gradient,
              transition: 'all 0.4s ease',
              borderRadius: '24px 24px 0 0',
            }} />

            
            <div style={{ position: 'relative', zIndex: 1 }}>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: `${skill.color}15`,
                  border: `1px solid ${skill.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === index ? 'rotate(-5deg) scale(1.1)' : 'rotate(0) scale(1)',
                }}>
                  <skill.icon style={{
                    fontSize: 28,
                    color: skill.color,
                    filter: `drop-shadow(0 0 10px ${skill.color}60)`,
                  }} />
                </div>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: 4,
                  }}>
                    {skill.title}
                  </h3>
                  <span style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 11,
                    color: skill.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}>
                    {skill.tags.length} Technologies
                  </span>
                </div>
              </div>

              
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '0.6rem',
              }}>
                {skill.tags.map((tag, tagIndex) => {
                  const tagId = `${index}-${tagIndex}`
                  return (
                    <div
                      key={tag.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 14px',
                        borderRadius: 12,
                        background: hoveredTag === tagId 
                          ? `${skill.color}20` 
                          : 'rgba(255, 255, 255, 0.04)',
                        border: `1px solid ${hoveredTag === tagId ? `${skill.color}50` : 'rgba(255, 255, 255, 0.08)'}`,
                        transition: 'all 0.25s ease',
                        cursor: 'default',
                        transform: hoveredTag === tagId ? 'translateY(-2px)' : 'translateY(0)',
                      }}
                      onMouseEnter={() => setHoveredTag(tagId)}
                      onMouseLeave={() => setHoveredTag(null)}
                    >
                      <tag.icon style={{
                        fontSize: 14,
                        color: hoveredTag === tagId ? skill.color : 'var(--text-secondary)',
                        transition: 'color 0.25s ease',
                      }} />
                      <span style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: hoveredTag === tagId ? 'var(--text)' : 'var(--text-secondary)',
                        transition: 'color 0.25s ease',
                      }}>
                        {tag.name}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            
            <div style={{
              position: 'absolute',
              bottom: 12,
              right: 16,
              fontFamily: 'var(--mono)',
              fontSize: 10,
              color: skill.color,
              opacity: hoveredCard === index ? 0.6 : 0.2,
              transition: 'opacity 0.3s ease',
            }}>
              {`0${index + 1}`}
            </div>
          </div>
        ))}
      </div>

      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '3rem',
        marginTop: '3rem',
        padding: '1.5rem 2rem',
        background: 'rgba(18, 18, 26, 0.5)',
        borderRadius: 20,
        border: '1px solid rgba(255, 255, 255, 0.04)',
        flexWrap: 'wrap',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.6s ease 0.8s',
      }}>
        {visibleStats.map((stat, i) => (
          <div key={stat.label} style={{
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            {i > 0 && (
              <div style={{
                width: 1,
                height: 30,
                background: 'var(--border)',
                marginRight: '0.75rem',
              }} />
            )}
            <div>
              <div style={{
                fontFamily: 'var(--mono)',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: stat.color,
                lineHeight: 1,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: 12,
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginTop: 4,
              }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      
      <div style={{
        textAlign: 'center',
        marginTop: '2rem',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.6s ease 1s',
      }}>
        <code style={{
          fontFamily: 'var(--mono)',
          fontSize: 12,
          color: 'var(--muted)',
          background: 'rgba(0, 212, 255, 0.05)',
          padding: '8px 16px',
          borderRadius: 8,
          border: '1px solid rgba(0, 212, 255, 0.1)',
        }}>
          <span style={{ color: 'var(--accent-green)' }}>$</span> {section.footerCommand}{' '}
          <span style={{
            display: 'inline-block', 
            width: 8, 
            height: 14, 
            background: 'var(--accent)', 
            marginLeft: 4,
            animation: 'blink 1s step-end infinite',
            verticalAlign: 'middle',
          }} />
        </code>
      </div>
    </section>
  )
}
