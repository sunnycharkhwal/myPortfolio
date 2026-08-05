import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import DashboardTopbar from '../components/dashboard/DashboardTopbar.jsx'
import ProjectsPanel from '../components/dashboard/ProjectsPanel.jsx'
import ExperiencePanel from '../components/dashboard/ExperiencePanel.jsx'
import ToastContainer from '../components/dashboard/ToastContainer.jsx'

const VALID_TABS = ['projects', 'experience']

export default function DashboardPage() {
  // Active tab lives in the URL (?tab=), not local state — a refresh reloads the page
  // fresh, so anything held only in useState resets to its default every time. The URL
  // survives a refresh (and is bookmarkable/shareable as a bonus), which local state
  // never would be.
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedTab = searchParams.get('tab')
  const activeTab = VALID_TABS.includes(requestedTab) ? requestedTab : 'projects'

  useEffect(() => {
    document.title = 'Dashboard | Sunny Charkhwal'
  }, [])

  const handleTabChange = (tab) => {
    // replace, not push — switching tabs shouldn't pile up browser-back history entries.
    setSearchParams({ tab }, { replace: true })
  }

  return (
    <div className="dashboard-page" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <DashboardTopbar activeTab={activeTab} onTabChange={handleTabChange} />
      {activeTab === 'projects' ? <ProjectsPanel /> : <ExperiencePanel />}
      <ToastContainer />
    </div>
  )
}
