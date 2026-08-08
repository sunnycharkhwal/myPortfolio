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
    // `color` is the one per-toast dynamic value (varies by severity) — passed through
    // as a CSS custom property rather than a full inline style object.
    <div className="dash-toast" style={{ '--toast-icon-color': color }}>
      <Icon className="dash-toast__icon" />
      <span className="dash-toast__message">{message}</span>
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
    <div className="dash-toast-container">
      {items.map((toast) => (
        <div key={toast.id} className="dash-toast-container__item">
          <Toast {...toast} />
        </div>
      ))}
    </div>
  )
}
