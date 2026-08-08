import { useState, useEffect } from 'react'
import { FaHeart, FaMapMarkerAlt, FaTerminal } from 'react-icons/fa'
import { FiArrowUp, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { getContactSettings } from '../api/contactSettingsApi.js'
import { listFooterLinks } from '../api/footerLinksApi.js'
import { listFooterTechIcons } from '../api/footerTechIconsApi.js'
import { getFooterSettings } from '../api/footerSettingsApi.js'
import { resolveIcon } from '../utils/iconRegistry.js'

// Fails open to this exact copy (not blank) both before the fetch resolves and if it
// ever fails — same precedent as Contact.jsx's own DEFAULT_SETTINGS (this is
// deliberately NOT shared code with Contact.jsx — two independent, self-contained
// public sections, same "no Redux for public content" convention every other section
// already follows, just both fetching the same underlying ContactSettings singleton).
const DEFAULT_CONTACT_SETTINGS = {
  email: 'sunny.charkhwal@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/in/sunnycharkhwal',
  githubUrl: 'https://github.com/sunnycharkhwal',
  location: 'New Delhi, India',
}
const DEFAULT_FOOTER_LINKS = [
  { _id: 'hero', label: 'Home', href: '#hero' },
  { _id: 'skills', label: 'Skills', href: '#skills' },
  { _id: 'projects', label: 'Projects', href: '#projects' },
  { _id: 'experience', label: 'Experience', href: '#experience' },
  { _id: 'contact', label: 'Contact', href: '#contact' },
]
const DEFAULT_FOOTER_TECH_ICONS = [
  { iconKey: 'SiDocker', color: '#2496ED' },
  { iconKey: 'SiKubernetes', color: '#326CE5' },
  { iconKey: 'SiTerraform', color: '#7B42BC' },
  { iconKey: 'FaAws', color: '#FF9900' },
  { iconKey: 'SiJenkins', color: '#D24939' },
  { iconKey: 'SiPrometheus', color: '#E6522C' },
]
const DEFAULT_FOOTER_SETTINGS = {
  brandName: 'Sunny Charkhwal',
  brandRole: 'DevOps Engineer',
  bio: 'Building scalable infrastructure and automating everything. Passionate about CI/CD, cloud-native technologies, and DevSecOps.',
  terminalCommand: 'echo "Thanks for visiting!"',
}

export default function Footer() {
  const [command, setCommand] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [contactSettings, setContactSettings] = useState(DEFAULT_CONTACT_SETTINGS)
  // Public content fetched live from the database — no Redux for the data itself, same
  // self-contained fetch pattern as Skills.jsx/Projects.jsx. Fails open to the defaults
  // above on error rather than crashing the page; disabled links/icons are filtered out
  // client-side, same `enabled !== false` convention used everywhere else.
  const [rawLinks, setRawLinks] = useState(DEFAULT_FOOTER_LINKS)
  const [rawTechIcons, setRawTechIcons] = useState(DEFAULT_FOOTER_TECH_ICONS)
  const [footerSettings, setFooterSettings] = useState(DEFAULT_FOOTER_SETTINGS)

  useEffect(() => {
    let cancelled = false
    Promise.all([getContactSettings(), listFooterLinks(), listFooterTechIcons(), getFooterSettings()])
      .then(([contactData, linksData, techIconsData, footerData]) => {
        if (cancelled) return
        if (contactData && Object.keys(contactData).length > 0) {
          setContactSettings((prev) => ({ ...prev, ...contactData }))
        }
        // Always replace (even with an empty array) — unlike the singletons above,
        // an empty list here is a legitimate "the admin deleted everything" state,
        // not "nothing saved yet", so it must not stay pinned to the hardcoded defaults.
        if (Array.isArray(linksData)) setRawLinks(linksData)
        if (Array.isArray(techIconsData)) setRawTechIcons(techIconsData)
        if (footerData && Object.keys(footerData).length > 0) {
          setFooterSettings((prev) => ({ ...prev, ...footerData }))
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  // Built here (not a static data/footer.js export) since the hrefs are now live —
  // same Icon+href+label shape the old FOOTER_SOCIAL_LINKS constant had.
  const socialLinks = [
    { Icon: FiGithub, href: contactSettings.githubUrl, label: 'GitHub' },
    { Icon: FiLinkedin, href: contactSettings.linkedinUrl, label: 'LinkedIn' },
    { Icon: FiMail, href: `mailto:${contactSettings.email}`, label: 'Email' },
  ].filter((link) => link.href)

  const quickLinks = rawLinks.filter((l) => l.enabled !== false)
  const techIcons = rawTechIcons
    .filter((t) => t.enabled !== false)
    .map((t) => ({ Icon: resolveIcon(t.iconKey), color: t.color }))

  useEffect(() => {
    let i = 0
    const typeInterval = setInterval(() => {
      if (i < footerSettings.terminalCommand.length) {
        setCommand(footerSettings.terminalCommand.slice(0, i + 1))
        i++
      } else {
        clearInterval(typeInterval)
      }
    }, 100)
    return () => clearInterval(typeInterval)
  }, [footerSettings.terminalCommand])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    return () => clearInterval(cursorInterval)
  }, [])

  const currentYear = new Date().getFullYear()

  return (
    <footer style={{
      position: 'relative',
      zIndex: 1,
      background: 'linear-gradient(180deg, var(--bg) 0%, #06060a 100%)',
      borderTop: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: -100,
        left: -100,
        width: 300,
        height: 300,
        background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: -100,
        right: -100,
        width: 300,
        height: 300,
        background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        maxWidth: 1200,
        margin: '0 auto',
        padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem) clamp(1.5rem, 3vw, 2rem)',
      }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: 'clamp(1.5rem, 4vw, 3rem)',
          marginBottom: 'clamp(1.5rem, 4vw, 3rem)',
        }}>
          
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: '1.25rem',
            }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'var(--gradient-1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(0,212,255,0.3)',
                flexShrink: 0,
              }}>
                <FaTerminal style={{ fontSize: 20, color: '#0a0a0f' }} />
              </div>
              <div>
                <div style={{ 
                  fontSize: 'clamp(16px, 2.5vw, 18px)', 
                  fontWeight: 700, 
                  background: 'var(--gradient-1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {footerSettings.brandName}
                </div>
                <div style={{
                  fontSize: 12,
                  color: 'var(--muted)',
                  fontFamily: 'var(--mono)',
                }}>
                  {footerSettings.brandRole}
                </div>
              </div>
            </div>

            <p style={{
              fontSize: 'clamp(13px, 2vw, 14px)',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '1.5rem',
            }}>
              {footerSettings.bio}
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: 'var(--muted)',
            }}>
              <FaMapMarkerAlt style={{ color: 'var(--accent-pink)' }} />
              <span>{contactSettings.location}</span>
            </div>
          </div>

          <div>
            <h4 style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text)',
              marginBottom: '1.25rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {quickLinks.map(link => (
                <li key={link.label} style={{ marginBottom: 12 }}>
                  <a 
                    href={link.href}
                    style={{
                      fontSize: 14,
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = 'var(--accent)'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'var(--text-secondary)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    <span style={{ 
                      color: 'var(--accent)', 
                      opacity: 0.5,
                      fontSize: 10,
                    }}>▸</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text)',
              marginBottom: '1.25rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              Connect
            </h4>
            
            <div style={{
              display: 'flex',
              gap: 12,
              marginBottom: '1.5rem',
            }}>
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent)'
                    e.currentTarget.style.background = 'rgba(0,212,255,0.1)'
                    e.currentTarget.style.transform = 'translateY(-3px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <Icon style={{ fontSize: 18, color: 'var(--text-secondary)' }} />
                </a>
              ))}
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '12px 14px',
              fontFamily: 'var(--mono)',
              fontSize: 'clamp(11px, 1.5vw, 12px)',
            }}>
              <div style={{ color: 'var(--muted)', marginBottom: 6 }}>
                <span style={{ color: 'var(--accent-green)' }}>➜</span>
                <span style={{ color: 'var(--accent)' }}> ~</span>
              </div>
              <div>
                <span style={{ color: 'var(--accent-green)' }}>$</span>
                <span style={{ color: 'var(--text)', marginLeft: 8 }}>{command}</span>
                <span style={{
                  display: 'inline-block',
                  width: 8,
                  height: 14,
                  background: showCursor ? 'var(--accent)' : 'transparent',
                  marginLeft: 2,
                  verticalAlign: 'middle',
                }} />
              </div>
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(0.75rem, 2vw, 1.5rem)',
          marginBottom: '1.5rem',
        }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <div style={{ display: 'flex', gap: 'clamp(10px, 2vw, 16px)' }}>
            {techIcons.map(({ Icon, color }, i) => (
              <Icon 
                key={i} 
                style={{ 
                  fontSize: 'clamp(14px, 2vw, 18px)', 
                  color: color,
                  opacity: 0.6,
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.opacity = '1'
                  e.currentTarget.style.transform = 'scale(1.2)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.opacity = '0.6'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              />
            ))}
          </div>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'clamp(0.75rem, 2vw, 1.5rem)',
          textAlign: 'center',
        }}>
          <div style={{ 
            fontSize: 'clamp(11px, 1.5vw, 13px)', 
            color: 'var(--muted)',
          }}>
            © {currentYear} {footerSettings.brandName}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 'clamp(11px, 1.5vw, 13px)',
            color: 'var(--muted)',
          }}>
            <span>Crafted with</span>
            <FaHeart style={{ 
              color: '#ff6b6b', 
              fontSize: 12,
              animation: 'pulse 2s ease-in-out infinite',
            }} />
            <span>&</span>
            <span style={{ fontFamily: 'var(--mono)', color: 'var(--accent)' }}>☕</span>
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              color: 'var(--text-secondary)',
              fontSize: 12,
              fontFamily: 'var(--mono)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.color = 'var(--accent)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
          >
            <FiArrowUp style={{ fontSize: 14 }} />
            <span>Top</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
    </footer>
  )
}
