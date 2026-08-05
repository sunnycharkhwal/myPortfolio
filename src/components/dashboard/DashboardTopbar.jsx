import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../store/authSlice.js'

const tabs = [
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
]

export default function DashboardTopbar({ activeTab, onTabChange }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem clamp(1rem, 4vw, 2rem)',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(18, 18, 26, 0.6)',
      }}
    >
      <div style={{ fontFamily: 'var(--mono)', fontSize: 20, fontWeight: 700 }}>
        <span style={{ color: 'var(--accent)' }}>S</span>
        <span style={{ color: 'var(--accent-purple)' }}>C</span>
        <span style={{ color: 'var(--muted)' }}>:</span>
        <span style={{ color: 'var(--accent-green)' }}>//</span>
        <span style={{ color: 'var(--text)' }}>dashboard</span>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 4,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 50,
          padding: 4,
        }}
      >
        {tabs.map((t) => {
          const isActive = activeTab === t.id
          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              style={{
                padding: '8px 18px',
                borderRadius: 30,
                border: 'none',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)'
                  : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      <button
        onClick={handleLogout}
        style={{
          padding: '8px 16px',
          borderRadius: 8,
          border: '1px solid var(--border)',
          background: 'rgba(255,255,255,0.03)',
          color: 'var(--text-secondary)',
          fontSize: 13,
          cursor: 'pointer',
        }}
      >
        Logout
      </button>
    </div>
  )
}
