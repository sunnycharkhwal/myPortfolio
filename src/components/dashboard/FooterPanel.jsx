import { useSearchParams } from 'react-router-dom'
import FooterLinksSection from './FooterLinksSection.jsx'
import FooterTechIconsSection from './FooterTechIconsSection.jsx'
import FooterSettingsForm from './FooterSettingsForm.jsx'

const VALID_VIEWS = ['links', 'tech-icons', 'settings']

// Top-level dashboard tab for the Footer — three views: "Links" (Quick Links list,
// full CRUD) and "Tech Icons" (the divider-strip icons, full CRUD) each delegate to
// their own self-contained section component, "Settings" (brand name/role/bio/
// terminal line) delegates to FooterSettingsForm — same `?view=` URL-state pattern
// ProjectsPanel.jsx's 3-tab split (Projects/Categories/Presets) already uses.
export default function FooterPanel() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedView = searchParams.get('view')
  const view = VALID_VIEWS.includes(requestedView) ? requestedView : 'links'
  const setView = (nextView) => {
    const next = new URLSearchParams(searchParams)
    next.set('view', nextView)
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="dash-panel">
      <div className="dash-view-tabs">
        {[
          { id: 'links', label: 'Links' },
          { id: 'tech-icons', label: 'Tech Icons' },
          { id: 'settings', label: 'Settings' },
        ].map((t) => {
          const isActive = view === t.id
          return (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              className={`dash-view-tab${isActive ? ' active' : ''}`}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {view === 'tech-icons' ? (
        <FooterTechIconsSection />
      ) : view === 'settings' ? (
        <FooterSettingsForm />
      ) : (
        <FooterLinksSection />
      )}
    </div>
  )
}
