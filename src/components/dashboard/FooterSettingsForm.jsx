import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { fetchFooterSettingsForEdit, saveFooterSettings } from '../../store/footerSettingsSlice.js'
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

// The Footer's own brand copy — name/role/bio/terminal line — as opposed to FooterLink/
// FooterTechIcon (the two repeatable lists managed by FooterPanel's other views) and
// ContactSettings (the actual email/phone/LinkedIn/GitHub/location, managed from the
// Contact tab and already shared with the Footer's social icons). Same "one settings
// form, one Save button" shape as HeroPanel.jsx/SkillsSectionForm.jsx.
export default function FooterSettingsForm() {
  const dispatch = useDispatch()
  const { mutationStatus, error } = useSelector((s) => s.footerSettings)
  const [loaded, setLoaded] = useState(false)
  const [form, setForm] = useState({ brandName: '', brandRole: '', bio: '', terminalCommand: '' })
  const [localError, setLocalError] = useState(null)

  useEffect(() => {
    dispatch(fetchFooterSettingsForEdit()).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        const settings = action.payload || {}
        setForm({
          brandName: settings.brandName || '',
          brandRole: settings.brandRole || '',
          bio: settings.bio || '',
          terminalCommand: settings.terminalCommand || '',
        })
      }
      setLoaded(true)
    })
  }, [dispatch])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.brandName.trim() || !form.brandRole.trim()) {
      setLocalError('Name and role are required')
      return
    }
    setLocalError(null)

    const result = await dispatch(saveFooterSettings(form))
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(addToast({ message: 'Footer settings updated', severity: 'success' }))
    }
  }

  if (!loaded) {
    return <p className="dash-muted-text">Loading…</p>
  }

  return (
    <div className="dash-panel--narrow">
      <p className="dash-hero-intro">
        The Footer's own brand copy — the name/role next to the logo, the short bio
        underneath, and the command typed out in the little terminal box. The email/
        phone/LinkedIn/GitHub/location shown elsewhere in the Footer are managed from
        the Contact tab's Settings view instead, since those are shared with the
        Contact section too.
      </p>

      <form onSubmit={handleSubmit}>
        {(localError || (mutationStatus === 'failed' && error)) && (
          <div className="dash-alert dash-alert--error">
            {localError || error}
          </div>
        )}

        <div className="dash-field-column dash-field-column--lg">
          <div className="dash-field-row">
            <TextField label="Name" required fullWidth value={form.brandName} onChange={set('brandName')} sx={fieldSx} />
            <TextField label="Role" required fullWidth value={form.brandRole} onChange={set('brandRole')} sx={fieldSx} />
          </div>
          <TextField label="Bio" fullWidth multiline minRows={2} value={form.bio} onChange={set('bio')} sx={fieldSx} />
          <TextField
            label="Terminal command"
            fullWidth
            value={form.terminalCommand}
            onChange={set('terminalCommand')}
            helperText='Typed out character-by-character in the little terminal box, e.g. echo "Thanks for visiting!"'
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
