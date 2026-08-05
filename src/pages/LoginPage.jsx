import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { login } from '../store/authSlice.js'

const cardStyle = {
  width: '100%',
  maxWidth: 400,
  background: 'linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%)',
  border: '1px solid var(--border)',
  borderRadius: 20,
  padding: 'clamp(1.75rem, 5vw, 2.5rem)',
  boxShadow: '0 30px 60px -20px rgba(0, 0, 0, 0.6)',
}

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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'var(--bg)',
      }}
    >
      <form onSubmit={handleSubmit} style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            <span style={{ color: 'var(--accent)' }}>S</span>
            <span style={{ color: 'var(--accent-purple)' }}>C</span>
            <span style={{ color: 'var(--muted)' }}>:</span>
            <span style={{ color: 'var(--accent-green)' }}>//</span>
            <span style={{ color: 'var(--text)' }}>dashboard</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Sign in to continue</p>
        </div>

        {searchParams.get('reset') === 'success' && (
          <div
            style={{
              marginBottom: '1.25rem',
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: 'var(--accent-green)',
              fontSize: 13,
            }}
          >
            Password reset — please log in with your new password.
          </div>
        )}

        {status === 'failed' && error && (
          <div
            style={{
              marginBottom: '1.25rem',
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(255, 107, 107, 0.1)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              color: 'var(--accent-pink)',
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            sx={fieldSx}
          />
        </div>

        <Button type="submit" fullWidth disabled={status === 'loading'} sx={submitSx}>
          {status === 'loading' ? 'Signing in…' : 'Sign in'}
        </Button>

        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <Link
            to="/forgot-password"
            style={{ color: 'var(--text-secondary)', fontSize: 13, textDecoration: 'none' }}
          >
            Forgot password?
          </Link>
        </div>
      </form>
    </div>
  )
}
