import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import * as authApi from '../api/authApi.js'

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
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
            Reset your password
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Enter your account email and we'll send you a reset link.
          </p>
        </div>

        {submitted ? (
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 10,
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: 'var(--accent-green)',
              fontSize: 13.5,
              lineHeight: 1.6,
            }}
          >
            If that email is registered, a reset link has been sent. Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
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

        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <Link to="/login" style={{ color: 'var(--text-secondary)', fontSize: 13, textDecoration: 'none' }}>
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
