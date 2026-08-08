import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../store/authSlice.js'
import ConfirmDialog from './ConfirmDialog.jsx'

const tabs = [
  { id: 'hero', label: 'Hero' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
  { id: 'footer', label: 'Footer' },
  { id: 'settings', label: 'Settings' },
]

export default function DashboardTopbar({ activeTab, onTabChange }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // Same confirm-before-destructive-action pattern every delete button in this
  // dashboard already uses — logging out isn't destructive to data, but it does end
  // the session, so a stray click shouldn't do it without asking first.
  const [confirmOpen, setConfirmOpen] = useState(false)

  const confirmLogout = () => {
    setConfirmOpen(false)
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <div className="dash-topbar">
      <div className="dash-logo">
        <span className="dash-logo__s">S</span>
        <span className="dash-logo__c">C</span>
        <span className="dash-logo__colon">:</span>
        <span className="dash-logo__slash">//</span>
        <span className="dash-logo__label">dashboard</span>
      </div>

      <div className="dash-topbar__tabs">
        {tabs.map((t) => {
          const isActive = activeTab === t.id
          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`dash-topbar__tab${isActive ? ' active' : ''}`}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      <button onClick={() => setConfirmOpen(true)} className="dash-topbar__logout">
        Logout
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title="Log out?"
        message="You'll need to sign in again to make any more changes."
        confirmLabel="Logout"
        onConfirm={confirmLogout}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
