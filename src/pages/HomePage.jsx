import { useEffect, useState } from 'react'
import useActiveSection from '../hooks/useActiveSection.js'
import { getSiteSettings } from '../api/siteSettingsApi.js'
import Nav            from '../components/Nav.jsx'
import Hero           from '../components/Hero.jsx'
import Skills         from '../components/Skills.jsx'
import Projects       from '../components/Projects.jsx'
import Experience     from '../components/Experience.jsx'
import Contact        from '../components/Contact.jsx'
import Footer         from '../components/Footer.jsx'
import BackToTop      from '../components/BackToTop.jsx'
import DevOpsBackground from '../components/DevOpsBackground.jsx'

const DEFAULT_SECTIONS = {
  hero: { enabled: true },
  skills: { enabled: true },
  projects: { enabled: true },
  experience: { enabled: true },
  contact: { enabled: true },
}

// The public portfolio — moved verbatim out of App.jsx so App.jsx can become a pure
// route table. Zero behavior change: this is only ever mounted at "/", so Nav's
// document.getElementById calls and useActiveSection's IntersectionObserver never run
// on any other route.
export default function HomePage() {
  useActiveSection()
  // Whole-section visibility, dashboard-managed (Settings tab → General). Fetched here
  // (not passed down) so an admin flipping a section off actually stops it from
  // mounting at all, not just hides it with CSS — same "fails open to all-enabled"
  // precedent as every other public-content fetch in this app.
  const [sections, setSections] = useState(DEFAULT_SECTIONS)

  useEffect(() => {
    let cancelled = false
    getSiteSettings()
      .then((data) => {
        if (!cancelled && data?.sections) {
          setSections((prev) => ({ ...prev, ...data.sections }))
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <DevOpsBackground />
      <Nav />
      {sections.hero.enabled !== false && <Hero />}
      {sections.skills.enabled !== false && <Skills />}
      {sections.projects.enabled !== false && <Projects />}
      {sections.experience.enabled !== false && <Experience />}
      {sections.contact.enabled !== false && <Contact />}
      <Footer />
      <BackToTop />
    </>
  )
}
