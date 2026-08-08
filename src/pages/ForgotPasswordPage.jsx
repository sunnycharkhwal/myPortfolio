import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import * as authApi from '../api/authApi.js'

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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.title = 'Forgot Password | Sunny Charkhwal'
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await authApi.forgotPassword(email)
      // Backend always returns a generic 200 whether or not the email exists — the UI
      // must show the exact same success state either way, no exceptions.
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="dash-auth-page">
      <div className="dash-auth-card">
        <div className="dash-auth-card__header">
          <h1 className="dash-auth-card__title">
            Reset your password
          </h1>
          <p className="dash-auth-card__subtitle">
            Enter your account email and we'll send you a reset link.
          </p>
        </div>

        {submitted ? (
          <div className="dash-alert dash-alert--success">
            If that email is registered, a reset link has been sent. Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="dash-alert dash-alert--error">
                {error}
              </div>
            )}
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              sx={{ ...fieldSx, marginBottom: '1.5rem' }}
            />
            <Button type="submit" fullWidth disabled={submitting} sx={submitSx}>
              {submitting ? 'Sending…' : 'Send reset link'}
            </Button>
          </form>
        )}

        <div className="dash-auth-footer">
          <Link to="/login" className="dash-auth-footer-link">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
