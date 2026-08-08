import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import { fetchSiteSettingsForEdit, saveSiteSettings } from '../../store/siteSettingsSlice.js'
import { addToast } from '../../store/toastSlice.js'
import { fileToDataUrl } from '../../utils/fileToDataUrl.js'
import SiteLogo from '../SiteLogo.jsx'

// Small enough that even a modest upload stays crisp inside the Nav's fixed logo box
// (see SiteLogo.jsx) — this is a soft safety net against an accidentally-huge file
// bloating the SiteSettings document, not a hard system limit.
const MAX_LOGO_BYTES = 2 * 1024 * 1024

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

const DEFAULT_SECTIONS = {
  hero: { enabled: true },
  skills: { enabled: true, title: 'Tech Stack', num: '01' },
  projects: { enabled: true, title: 'Project', num: '02' },
  experience: { enabled: true, title: 'Experience', num: '03' },
  contact: { enabled: true, title: 'Get In Touch', num: '04' },
}

const SECTION_LABELS = {
  hero: 'Hero',
  skills: 'Skills',
  projects: 'Projects',
  experience: 'Experience',
  contact: 'Contact',
}

// Site-wide chrome: the logo (image or text, shown in the Nav bar) and every section's
// own heading text/number/whole-section visibility toggle. Same "one settings form,
// one Save button" shape as HeroPanel.jsx/FooterSettingsForm.jsx.
export default function SiteSettingsForm() {
  const dispatch = useDispatch()
  const { mutationStatus, error } = useSelector((s) => s.siteSettings)
  const [loaded, setLoaded] = useState(false)
  const [logoType, setLogoType] = useState('text')
  const [logoText, setLogoText] = useState('SC://dev')
  const [logoImageUrl, setLogoImageUrl] = useState('')
  const [logoLink, setLogoLink] = useState('#hero')
  const [sections, setSections] = useState(DEFAULT_SECTIONS)
  const [localError, setLocalError] = useState(null)

  useEffect(() => {
    dispatch(fetchSiteSettingsForEdit()).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        const settings = action.payload || {}
        setLogoType(settings.logoType || 'text')
        setLogoText(settings.logoText || 'SC://dev')
        setLogoImageUrl(settings.logoImageUrl || '')
        setLogoLink(settings.logoLink || '#hero')
        setSections((prev) => {
          const next = { ...prev }
          for (const key of Object.keys(prev)) {
            if (settings.sections?.[key]) next[key] = { ...prev[key], ...settings.sections[key] }
          }
          return next
        })
      }
      setLoaded(true)
    })
  }, [dispatch])

  const updateSection = (key, patch) => setSections((s) => ({ ...s, [key]: { ...s[key], ...patch } }))

  const handleLogoFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (file.size > MAX_LOGO_BYTES) {
      setLocalError(`"${file.name}" is too large (max 2MB).`)
      return
    }
    const dataUrl = await fileToDataUrl(file)
    setLogoImageUrl(dataUrl)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (logoType === 'text' && !logoText.trim()) {
      setLocalError('Logo text is required when using a text logo')
      return
    }
    if (logoType === 'image' && !logoImageUrl.trim()) {
      setLocalError('Upload an image (or switch back to a text logo)')
      return
    }
    setLocalError(null)

    const result = await dispatch(saveSiteSettings({ logoType, logoText, logoImageUrl, logoLink, sections }))
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(addToast({ message: 'Site settings updated', severity: 'success' }))
    }
  }

  if (!loaded) {
    return <p className="dash-muted-text">Loading…</p>
  }

  // Live preview reflects the form's current (unsaved) state, not just what's stored —
  // same "see it before you commit" spirit as every other admin-authored preview in
  // this dashboard (e.g. IconPicker's resolved icon next to its key).
  const previewSettings = { logoType, logoText, logoImageUrl, logoLink }

  return (
    <div className="dash-panel--narrow">
      <p className="dash-hero-intro">
        The site-wide logo shown in the Nav bar, plus each section's own heading text/
        number and a whole-section on/off switch. Disabling a section removes it from
        the public page entirely (not just visually hidden) and its Nav link stops
        appearing too.
      </p>

      <form onSubmit={handleSubmit}>
        {(localError || (mutationStatus === 'failed' && error)) && (
          <div className="dash-alert dash-alert--error">
            {localError || error}
          </div>
        )}

        <div className="dash-field-column dash-field-column--lg">
          <div>
            <div className="dash-section-label">Logo</div>
            <div className="dash-row" style={{ marginBottom: 12 }}>
              <SiteLogo settings={previewSettings} size={26} />
              <span className="dash-hint-text" style={{ margin: 0 }}>← live preview</span>
            </div>

            <TextField select label="Logo type" value={logoType} onChange={(e) => setLogoType(e.target.value)} sx={{ ...fieldSx, maxWidth: 220 }}>
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="image">Image</MenuItem>
            </TextField>

            {logoType === 'text' ? (
              <TextField
                label="Logo text"
                fullWidth
                value={logoText}
                onChange={(e) => setLogoText(e.target.value)}
                sx={{ ...fieldSx, marginTop: '1rem' }}
              />
            ) : (
              <div style={{ marginTop: '1rem' }}>
                <label className="dash-upload-label">
                  📁 Upload logo image
                  <input type="file" accept="image/*" onChange={handleLogoFile} className="dash-hidden-input" />
                </label>
                <p className="dash-hero-footnote">
                  Best results: a square SVG or PNG with a transparent background, at
                  least 128×128px. It's always displayed at a small fixed size (never
                  stretched), so anything reasonably sized stays crisp.
                </p>
              </div>
            )}

            <TextField
              label="Logo click destination"
              fullWidth
              value={logoLink}
              onChange={(e) => setLogoLink(e.target.value)}
              helperText="An in-page anchor (e.g. #hero) or a full URL."
              sx={{ ...fieldSx, marginTop: '1rem' }}
            />
          </div>

          <div>
            <div className="dash-section-label">Sections</div>
            <div className="dash-row-group">
              {Object.keys(sections).map((key) => (
                <div key={key} className={`dash-row${sections[key].enabled === false ? ' dash-row--disabled' : ''}`}>
                  <span className="dash-w-40" style={{ fontWeight: 600, color: 'var(--text)' }}>
                    {SECTION_LABELS[key]}
                  </span>
                  {key !== 'hero' && (
                    <>
                      <TextField
                        label="Number"
                        value={sections[key].num || ''}
                        onChange={(e) => updateSection(key, { num: e.target.value })}
                        sx={{ ...fieldSx, flex: '1 1 20%' }}
                      />
                      <TextField
                        label="Title"
                        value={sections[key].title || ''}
                        onChange={(e) => updateSection(key, { title: e.target.value })}
                        sx={{ ...fieldSx, flex: '1 1 45%' }}
                      />
                    </>
                  )}
                  <Switch
                    checked={sections[key].enabled !== false}
                    onChange={(e) => updateSection(key, { enabled: e.target.checked })}
                    size="small"
                    title="Enabled — this section renders on the public site"
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' } }}
                  />
                </div>
              ))}
            </div>
          </div>
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
