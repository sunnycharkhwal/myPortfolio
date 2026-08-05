import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import * as authApi from '../api/authApi.js'

const PASSWORD_POLICY_MESSAGE =
  'Password must be at least 8 characters and include at least one letter and one number.'
const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/

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

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.title = 'Reset Password | Sunny Charkhwal'
  }, [])

  if (!token) {
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
        <div style={cardStyle}>
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 10,
              background: 'rgba(255, 107, 107, 0.1)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              color: 'var(--accent-pink)',
              fontSize: 13.5,
              marginBottom: '1.25rem',
            }}
          >
            This reset link is missing its token. Request a new one.
          </div>
          <Link to="/forgot-password" style={{ color: 'var(--accent)', fontSize: 13 }}>
            Request a new reset link
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!PASSWORD_RE.test(newPassword)) {
      setError(PASSWORD_POLICY_MESSAGE)
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      await authApi.resetPassword(token, newPassword)
      // Token isn't consumed by a failed attempt above, so it's still safe to reuse if
      // the form is resubmitted after a validation error. Only redirect on real success.
      navigate('/login?reset=success', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
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
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
            Set a new password
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{PASSWORD_POLICY_MESSAGE}</p>
        </div>

        {error && (
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
            label="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            fullWidth
            sx={fieldSx}
          />
        </div>

        <Button type="submit" fullWidth disabled={submitting} sx={submitSx}>
          {submitting ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </div>
  )
}
