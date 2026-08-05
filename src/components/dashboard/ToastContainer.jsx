import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import { removeToast } from '../../store/toastSlice.js'

const AUTO_DISMISS_MS = 3500

const ICONS = {
  success: CheckCircleIcon,
  info: DeleteIcon,
}
const COLORS = {
  success: 'var(--accent-green)',
  info: 'var(--accent-pink)',
}

function Toast({ id, message, severity }) {
  const dispatch = useDispatch()
  const Icon = ICONS[severity] || CheckCircleIcon
  const color = COLORS[severity] || 'var(--accent-green)'

  useEffect(() => {
    const timer = setTimeout(() => dispatch(removeToast(id)), AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [id, dispatch])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 14px',
        borderRadius: 12,
        background: 'linear-gradient(135deg, rgba(25, 25, 35, 0.98) 0%, rgba(15, 15, 22, 0.99) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.6)',
        minWidth: 260,
        maxWidth: 340,
        animation: 'toast-in 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <Icon style={{ fontSize: 18, color, flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: 'var(--text)', flex: 1, lineHeight: 1.4 }}>{message}</span>
      <IconButton size="small" onClick={() => dispatch(removeToast(id))} sx={{ color: 'var(--text-secondary)', padding: '2px' }}>
        <CloseIcon sx={{ fontSize: 14 }} />
      </IconButton>
    </div>
  )
}

// Mounted once in DashboardPage — a fixed stack on the side of the screen, one entry
// per action (create/update/delete), each auto-dismissing independently.
export default function ToastContainer() {
  const items = useSelector((s) => s.toast.items)

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        pointerEvents: 'none',
      }}
    >
      {items.map((toast) => (
        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
          <Toast {...toast} />
        </div>
      ))}
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(24px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
