import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { login } from '../store/authSlice.js'

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    color: 'var(--text)',
    '& fieldset': { borderColor: 'var(--border)' },
    '&:hover fieldset': { borderColor: 'rgba(0, 212, 255, 0.4)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--accent)' },
  },
  '& .MuiInputLabel-root': { color: 'var(--text-secondary)' },
  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--accent)' },
}

const submitSx = {
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: '50px',
  padding: '12px 0',
  background: 'var(--gradient-1)',
  color: '#0a0a0f',
  '&:hover': { background: 'var(--gradient-1)', opacity: 0.9 },
}

export default function LoginPage() {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const { token, user, bootstrapped, status, error } = useSelector((s) => s.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    document.title = 'Login | Sunny Charkhwal'
  }, [])

  // Already logged in — don't show a login form, but wait for bootstrap to resolve
  // first so a session-restore-in-progress doesn't flash the form before redirecting.
  if (bootstrapped && token && user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login({ email, password }))
  }

  return (
    <div className="dash-auth-page">
      <form onSubmit={handleSubmit} className="dash-auth-card">
        <div className="dash-auth-card__header">
          <div className="dash-logo">
            <span className="dash-logo__s">S</span>
            <span className="dash-logo__c">C</span>
            <span className="dash-logo__colon">:</span>
            <span className="dash-logo__slash">//</span>
            <span className="dash-logo__label">dashboard</span>
          </div>
          <p className="dash-auth-card__subtitle">Sign in to continue</p>
        </div>

        {searchParams.get('reset') === 'success' && (
          <div className="dash-alert dash-alert--success">
            Password reset — please log in with your new password.
          </div>
        )}

        {status === 'failed' && error && (
          <div className="dash-alert dash-alert--error">
            {error}
          </div>
        )}

        <div className="dash-field-group">
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            sx={fieldSx}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      // type="button" (not the native <button> default of "submit" inside
                      // a <form>) stops this from submitting the login form; preventing
                      // mousedown's default keeps focus on the field instead of stealing it.
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      sx={{ color: 'var(--text-secondary)' }}
                    >
                      {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>

        <Button type="submit" fullWidth disabled={status === 'loading'} sx={submitSx}>
          {status === 'loading' ? 'Signing in…' : 'Sign in'}
        </Button>

        <div className="dash-auth-footer">
          <Link to="/forgot-password" className="dash-auth-footer-link">
            Forgot password?
          </Link>
        </div>
      </form>
    </div>
  )
}
