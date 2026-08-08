import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { fetchContactSettingsForEdit, saveContactSettings } from '../../store/contactSettingsSlice.js'
import { addToast } from '../../store/toastSlice.js'

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

// The ACTUAL contact details — one email, one phone number, one LinkedIn/GitHub/
// location — used everywhere across the public site (Contact.jsx's mailto/tel/LinkedIn
// cards AND Footer.jsx's social icons + email link). Change it here once; every place
// that renders it re-fetches this same singleton. Same "one settings form, one Save
// button" shape as HeroPanel.jsx/SkillsSectionForm.jsx.
export default function ContactSettingsForm() {
  const dispatch = useDispatch()
  const { mutationStatus, error } = useSelector((s) => s.contactSettings)
  const [loaded, setLoaded] = useState(false)
  const [form, setForm] = useState({
    email: '',
    phone: '',
    phoneDisplay: '',
    linkedinUrl: '',
    linkedinHandle: '',
    githubUrl: '',
    location: '',
  })
  const [localError, setLocalError] = useState(null)

  useEffect(() => {
    dispatch(fetchContactSettingsForEdit()).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        const settings = action.payload || {}
        setForm({
          email: settings.email || '',
          phone: settings.phone || '',
          phoneDisplay: settings.phoneDisplay || '',
          linkedinUrl: settings.linkedinUrl || '',
          linkedinHandle: settings.linkedinHandle || '',
          githubUrl: settings.githubUrl || '',
          location: settings.location || '',
        })
      }
      setLoaded(true)
    })
  }, [dispatch])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email.trim() || !form.phone.trim() || !form.phoneDisplay.trim()) {
      setLocalError('Email, phone, and phone display are required')
      return
    }
    setLocalError(null)

    const result = await dispatch(saveContactSettings(form))
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(addToast({ message: 'Contact settings updated', severity: 'success' }))
    }
  }

  if (!loaded) {
    return <p className="dash-muted-text">Loading…</p>
  }

  return (
    <div className="dash-panel--narrow">
      <p className="dash-hero-intro">
        These are the real contact details used everywhere on the public site — the
        Contact section's Email/Phone/LinkedIn cards AND the Footer's social icons and
        email link all pull from this one place, so updating a value here updates it
        site-wide.
      </p>

      <form onSubmit={handleSubmit}>
        {(localError || (mutationStatus === 'failed' && error)) && (
          <div className="dash-alert dash-alert--error">
            {localError || error}
          </div>
        )}

        <div className="dash-field-column dash-field-column--lg">
          <TextField
            label="Email"
            required
            fullWidth
            type="email"
            value={form.email}
            onChange={set('email')}
            helperText="Used for the mailto: links in the Contact section and Footer."
            sx={fieldSx}
          />

          <div className="dash-field-row">
            <TextField
              label="Phone (for tel: links)"
              required
              fullWidth
              value={form.phone}
              onChange={set('phone')}
              placeholder="+919013030173"
              helperText="Digits/+ only — this is what dialing actually uses."
              sx={fieldSx}
            />
            <TextField
              label="Phone (displayed text)"
              required
              fullWidth
              value={form.phoneDisplay}
              onChange={set('phoneDisplay')}
              placeholder="+91 901 303 0173"
              helperText="The human-readable version shown on the page."
              sx={fieldSx}
            />
          </div>

          <div className="dash-field-row">
            <TextField label="LinkedIn URL" fullWidth value={form.linkedinUrl} onChange={set('linkedinUrl')} sx={fieldSx} />
            <TextField
              label="LinkedIn handle (displayed text)"
              fullWidth
              value={form.linkedinHandle}
              onChange={set('linkedinHandle')}
              placeholder="/in/yourname"
              sx={fieldSx}
            />
          </div>

          <TextField label="GitHub URL" fullWidth value={form.githubUrl} onChange={set('githubUrl')} sx={fieldSx} />
          <TextField
            label="Location"
            fullWidth
            value={form.location}
            onChange={set('location')}
            helperText={'Shown in the Footer (e.g. "New Delhi, India").'}
            sx={fieldSx}
          />
        </div>

        <Button
          type="submit"
          disabled={mutationStatus === 'loading'}
          sx={{
            marginTop: '2rem',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '50px',
            padding: '12px 32px',
            background: 'var(--gradient-1)',
            color: '#0a0a0f',
            '&:hover': { background: 'var(--gradient-1)', opacity: 0.9 },
          }}
        >
          {mutationStatus === 'loading' ? 'Saving…' : 'Save changes'}
        </Button>
      </form>
    </div>
  )
}
