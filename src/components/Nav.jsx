import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getContactSettings } from '../api/contactSettingsApi.js'
import { listSiteNavLinks } from '../api/siteNavLinksApi.js'
import { getSiteSettings } from '../api/siteSettingsApi.js'
import useScrolled from '../hooks/useScrolled.js'
import scrollTo from '../utils/scrollTo.js'
import SiteLogo from './SiteLogo.jsx'

// Same "fails open to the real default email" precedent as Contact.jsx/Footer.jsx's
// own DEFAULT_SETTINGS — this is deliberately its own tiny copy, not shared code, same
// "no Redux for public content" convention every self-contained public section follows.
const DEFAULT_EMAIL = 'sunny.charkhwal@gmail.com'
const DEFAULT_NAV_LINKS = [
  { _id: 'hero', label: 'Home', href: '#hero' },
  { _id: 'skills', label: 'Skills', href: '#skills' },
  { _id: 'projects', label: 'Projects', href: '#projects' },
  { _id: 'experience', label: 'Experience', href: '#experience' },
  { _id: 'contact', label: 'Contact', href: '#contact' },
]
const DEFAULT_SITE_SETTINGS = {
  logoType: 'text',
  logoText: 'SC://dev',
  logoImageUrl: '',
  logoLink: '#hero',
  sections: {
    hero: { enabled: true },
    skills: { enabled: true },
    projects: { enabled: true },
    experience: { enabled: true },
    contact: { enabled: true },
  },
}

export default function Nav() {
  const active = useSelector(state => state.ui.activeSection)
  const scrolled = useScrolled()
  const [open, setOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)
  const [contactEmail, setContactEmail] = useState(DEFAULT_EMAIL)
  // Public content fetched live from the database — no Redux for the data itself, same
  // self-contained fetch pattern as Skills.jsx/Footer.jsx. Fails open to the defaults
  // above on error rather than crashing the page.
  const [rawNavLinks, setRawNavLinks] = useState(DEFAULT_NAV_LINKS)
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SITE_SETTINGS)

  useEffect(() => {
    let cancelled = false
    Promise.all([getContactSettings(), listSiteNavLinks(), getSiteSettings()])
      .then(([contactData, navLinksData, settingsData]) => {
        if (cancelled) return
        if (contactData?.email) setContactEmail(contactData.email)
        // Always replace (even with an empty array) — an empty list here is a
        // legitimate "the admin deleted everything" state, not "nothing saved yet".
        if (Array.isArray(navLinksData)) setRawNavLinks(navLinksData)
        if (settingsData && Object.keys(settingsData).length > 0) {
          setSiteSettings((prev) => ({
            ...prev,
            ...settingsData,
            sections: { ...prev.sections, ...settingsData.sections },
          }))
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const go = (id) => {
    setOpen(false)
    setTimeout(() => scrollTo(id), open ? 320 : 0)
  }

  // A link whose href is one of the five known section anchors (#hero, #skills, ...)
  // disappears when that whole section is disabled from the dashboard's Settings tab
  // — a link to a section that isn't rendered would just silently do nothing, so this
  // is the enforcement half of "disable a section" (Skills.jsx etc. do the render half).
  // Any other href (a custom link, or a real URL) always shows.
  const sectionKeyFromHref = (href) => (href.startsWith('#') ? href.slice(1) : null)
  const allLinks = rawNavLinks
    .filter((l) => l.enabled !== false)
    .filter((l) => {
      const key = sectionKeyFromHref(l.href)
      if (!key || !(key in siteSettings.sections)) return true
      return siteSettings.sections[key]?.enabled !== false
    })

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(1.5rem, 5vw, 4rem)', height: 'var(--nav-h)',
        background: scrolled
          ? 'linear-gradient(180deg, rgba(10, 10, 15, 0.95) 0%, rgba(10, 10, 15, 0.85) 100%)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(8px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: scrolled ? '0 8px 32px rgba(0, 0, 0, 0.4)' : 'none',
      }}>

        <SiteLogo settings={siteSettings} size={22} />


        <ul style={{
          display: 'flex',
          gap: '0.5rem',
          listStyle: 'none',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: 50,
          padding: '6px 8px',
        }} className="sc-nav-links">
          {allLinks.map(l => {
            const id = l.href.startsWith('#') ? l.href.slice(1) : l.href
            const isHome = id === 'hero'
            const isActive = isHome ? (!active || active === 'hero') : active === id
            const isHovered = hoveredLink === l._id

            return (
              <li key={l._id}>
                <button
                  onClick={() => (l.href.startsWith('#') ? go(id) : window.open(l.href, '_blank', 'noopener,noreferrer'))}
                  onMouseEnter={() => setHoveredLink(l._id)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`sc-nav-link${isActive ? ' active' : ''}`}
                  style={{
                    position: 'relative',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)'
                      : 'transparent',
                    border: 'none',
                    borderRadius: 30,
                    padding: '10px 20px',
                    cursor: 'pointer',
                    fontFamily: 'var(--sans)',
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: '0.01em',
                    color: isActive ? 'var(--accent)' : isHovered ? 'var(--text)' : 'var(--text-secondary)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isHovered && !isActive ? 'translateY(-2px)' : 'translateY(0)',
                    boxShadow: isActive ? '0 0 20px rgba(0, 212, 255, 0.2), inset 0 0 20px rgba(0, 212, 255, 0.05)' : 'none',
                  }}
                >

                  {isActive && (
                    <span style={{
                      position: 'absolute',
                      bottom: 4,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      boxShadow: '0 0 8px var(--accent)',
                    }} />
                  )}
                  {l.label}
                </button>
              </li>
            )
          })}
        </ul>


        <a
          href={`mailto:${contactEmail}`}
          className="sc-hire"
          style={{
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <path d="M22 6l-10 7L2 6"/>
            </svg>
            Let's Connect
          </span>
        </a>


        <button
          className={`sc-hamburger${open ? ' open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>


      <div className={`sc-drawer${open ? ' open' : ''}`}>

        <button
          onClick={() => setOpen(false)}
          style={{
            position: 'absolute', top: 24, right: 24,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: 48, height: 48,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-secondary)', fontSize: 20, cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 107, 107, 0.1)'
            e.currentTarget.style.borderColor = 'rgba(255, 107, 107, 0.3)'
            e.currentTarget.style.color = 'var(--accent-pink)'
            e.currentTarget.style.transform = 'rotate(90deg)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
            e.currentTarget.style.color = 'var(--text-secondary)'
            e.currentTarget.style.transform = 'rotate(0deg)'
          }}
        >
          ✕
        </button>

        <div style={{ marginBottom: '0.75rem' }}>
          <SiteLogo settings={siteSettings} size={28} />
        </div>


        {allLinks.map((l, i) => {
          const id = l.href.startsWith('#') ? l.href.slice(1) : l.href
          const isHome = id === 'hero'
          const isActive = isHome ? (!active || active === 'hero') : active === id

          return (
            <button
              key={l._id}
              onClick={() => (l.href.startsWith('#') ? go(id) : window.open(l.href, '_blank', 'noopener,noreferrer'))}
              className={`sc-nav-link-drawer${isActive ? ' active' : ''}`}
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)'
                  : 'transparent',
                border: isActive ? '1px solid rgba(0, 212, 255, 0.2)' : '1px solid transparent',
                borderRadius: 16,
                padding: '16px 40px',
                cursor: 'pointer',
                fontFamily: 'var(--sans)',
                fontSize: '1.25rem',
                fontWeight: isActive ? 600 : 500,
                letterSpacing: '0.02em',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                transition: 'all 0.3s ease',
                transitionDelay: `${i * 0.05}s`,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text)'
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                  e.currentTarget.style.transform = 'translateX(8px)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-secondary)'
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.transform = 'translateX(0)'
                }
              }}
            >
              {isActive && (
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  boxShadow: '0 0 12px var(--accent)',
                }} />
              )}
              {l.label}
            </button>
          )
        })}


        <a
          href={`mailto:${contactEmail}`}
          style={{
            marginTop: '0.5rem',
            fontFamily: 'var(--sans)',
            fontSize: 16,
            fontWeight: 600,
            padding: '16px 40px',
            background: 'var(--gradient-1)',
            borderRadius: 50,
            color: '#0a0a0f',
            textDecoration: 'none',
            boxShadow: '0 0 40px rgba(0, 212, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.boxShadow = '0 0 50px rgba(0, 212, 255, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 212, 255, 0.3)'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <path d="M22 6l-10 7L2 6"/>
          </svg>
          Let's Connect
        </a>
      </div>
    </>
  )
}
