import { useSearchParams } from 'react-router-dom'
import SiteSettingsForm from './SiteSettingsForm.jsx'
import SiteNavLinksSection from './SiteNavLinksSection.jsx'

const VALID_VIEWS = ['general', 'nav-links']

// Top-level dashboard tab for site-wide chrome that doesn't belong to any one section:
// the logo + each section's heading/visibility ("General") and the Nav bar's link list
// ("Nav Links", full CRUD) — same `?view=` URL-state pattern FooterPanel.jsx's 3-tab
// split already uses.
export default function SettingsPanel() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedView = searchParams.get('view')
  const view = VALID_VIEWS.includes(requestedView) ? requestedView : 'general'
  const setView = (nextView) => {
    const next = new URLSearchParams(searchParams)
    next.set('view', nextView)
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="dash-panel">
      <div className="dash-view-tabs">
        {[
          { id: 'general', label: 'General' },
          { id: 'nav-links', label: 'Nav Links' },
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

      {view === 'nav-links' ? <SiteNavLinksSection /> : <SiteSettingsForm />}
    </div>
  )
}
