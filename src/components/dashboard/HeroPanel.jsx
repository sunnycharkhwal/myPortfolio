import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import DeleteIcon from '@mui/icons-material/Delete'
import { fetchHeroForEdit, saveHero } from '../../store/heroSlice.js'
import { addToast } from '../../store/toastSlice.js'
import { ICON_KEYS } from '../../utils/iconRegistry.js'
import { fileToDataUrl } from '../../utils/fileToDataUrl.js'
import RichTextEditor from './RichTextEditor.jsx'
import IconPicker from './IconPicker.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'

// Resumes are typically well under 1MB, but PDFs with embedded graphics can run
// larger — 5MB is generous headroom without letting an upload silently bloat the Hero
// document (base64 data-URIs are stored directly on it, same as project images/downloads).
const MAX_RESUME_BYTES = 5 * 1024 * 1024

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

// Unlike every other dashboard panel, Hero has no list to browse and no modal to open —
// it's ONE document (see server/src/models/Hero.js's unique index on `user`), so this
// is a single always-visible settings form with one Save button, not a CRUD grid. Loaded
// once on mount straight from the fetch thunk's own resolved payload (not synced via a
// useEffect watching Redux state) specifically so a later save's response updating
// state.hero.data doesn't turn around and stomp on whatever the admin is mid-typing.
export default function HeroPanel() {
  const dispatch = useDispatch()
  const { mutationStatus, error } = useSelector((s) => s.hero)
  const [loaded, setLoaded] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', statusBadge: '' })
  const [bio, setBio] = useState('')
  const [roleRows, setRoleRows] = useState([])
  const [statRows, setStatRows] = useState([])
  const [techRows, setTechRows] = useState([])
  const [resumeUrl, setResumeUrl] = useState('')
  const [localError, setLocalError] = useState(null)
  // One shared confirm-before-delete flow for all three repeatable-row sections below —
  // { kind: 'role' | 'stat' | 'tech', index } — same ConfirmDialog every other delete
  // action in this dashboard already uses, so removing a role/stat/tech icon asks first
  // instead of vanishing immediately.
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    dispatch(fetchHeroForEdit()).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        const hero = action.payload || {}
        setForm({
          firstName: hero.firstName || '',
          lastName: hero.lastName || '',
          statusBadge: hero.statusBadge || '',
        })
        setBio(hero.bio || '')
        setRoleRows([...(hero.roles || [])])
        setStatRows((hero.stats || []).map((s) => ({ ...s, enabled: s.enabled ?? true })))
        setTechRows((hero.techStack || []).map((t) => ({ ...t, enabled: t.enabled ?? true })))
        setResumeUrl(hero.resumeUrl || '')
      }
      setLoaded(true)
    })
  }, [dispatch])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const updateRoleRow = (i, value) => setRoleRows((rows) => rows.map((r, idx) => (idx === i ? value : r)))
  const addRoleRow = () => setRoleRows((rows) => [...rows, ''])
  const removeRoleRow = (i) => setRoleRows((rows) => rows.filter((_, idx) => idx !== i))

  const updateStatRow = (i, patch) => setStatRows((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
  const addStatRow = () => setStatRows((rows) => [...rows, { value: '', label: '', color: '#00d4ff', enabled: true }])
  const removeStatRow = (i) => setStatRows((rows) => rows.filter((_, idx) => idx !== i))

  const updateTechRow = (i, patch) => setTechRows((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
  const addTechRow = () => setTechRows((rows) => [...rows, { iconKey: ICON_KEYS[0], name: '', color: '#ffffff', enabled: true }])
  const removeTechRow = (i) => setTechRows((rows) => rows.filter((_, idx) => idx !== i))

  // Every row's × button routes through here instead of calling removeXRow directly —
  // opens the shared ConfirmDialog first.
  const requestRemove = (kind, index) => setDeleteTarget({ kind, index })
  const confirmRemove = () => {
    if (!deleteTarget) return
    const { kind, index } = deleteTarget
    if (kind === 'role') removeRoleRow(index)
    else if (kind === 'stat') removeStatRow(index)
    else if (kind === 'tech') removeTechRow(index)
    setDeleteTarget(null)
  }

  // Resume can come from either input — pasted URL or an uploaded file read into a
  // base64 data-URI (see fileToDataUrl.js) — both just become the same resumeUrl
  // string, same duality Project.downloads[].url already uses.
  const handleResumeFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (file.size > MAX_RESUME_BYTES) {
      setLocalError(`"${file.name}" is too large (max 5MB).`)
      return
    }
    const dataUrl = await fileToDataUrl(file)
    setResumeUrl(dataUrl)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.firstName.trim() || !form.lastName.trim() || !form.statusBadge.trim()) {
      setLocalError('First name, last name, and status badge are required')
      return
    }
    setLocalError(null)

    const data = {
      firstName: form.firstName,
      lastName: form.lastName,
      statusBadge: form.statusBadge,
      roles: roleRows.map((r) => r.trim()).filter(Boolean),
      bio,
      stats: statRows.filter((s) => s.value.trim() && s.label.trim()).map((s) => ({ ...s, enabled: s.enabled !== false })),
      techStack: techRows.filter((t) => t.iconKey && t.name.trim()).map((t) => ({ ...t, enabled: t.enabled !== false })),
      resumeUrl: resumeUrl.trim(),
    }

    const result = await dispatch(saveHero(data))
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(addToast({ message: 'Hero section updated', severity: 'success' }))
    }
  }

  if (!loaded) {
    return (
      <div className="dash-panel">
        <p className="dash-muted-text">Loading…</p>
      </div>
    )
  }

  return (
    <div className="dash-panel dash-panel--narrow">
      <p className="dash-hero-intro">
        This is the ONE hero section shown at the top of the public site — there's nothing to add or
        delete here, just a single form to keep up to date. Changes take effect the moment you save,
        same as everything else in this dashboard.
      </p>

      <form onSubmit={handleSubmit}>
        {(localError || (mutationStatus === 'failed' && error)) && (
          <div className="dash-alert dash-alert--error">
            {localError || error}
          </div>
        )}

        <div className="dash-field-column dash-field-column--lg">
          <div className="dash-field-row">
            <TextField label="First name" required fullWidth value={form.firstName} onChange={set('firstName')} sx={fieldSx} />
            <TextField label="Last name" required fullWidth value={form.lastName} onChange={set('lastName')} sx={fieldSx} />
          </div>

          <TextField
            label="Status badge"
            required
            fullWidth
            value={form.statusBadge}
            onChange={set('statusBadge')}
            helperText='The small animated pill above your name — e.g. "Open to Opportunities"'
            sx={fieldSx}
          />

          <div>
            <div className="dash-section-label">Typewriter roles</div>
            <div className="dash-row-group dash-row-group--sm">
              {roleRows.map((role, i) => (
                <div key={i} className="dash-row">
                  <TextField
                    fullWidth
                    label={`Role ${i + 1}`}
                    value={role}
                    onChange={(e) => updateRoleRow(i, e.target.value)}
                    sx={fieldSx}
                  />
                  <IconButton size="small" onClick={() => requestRemove('role', i)} sx={{ color: 'var(--accent-pink)' }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
            <button type="button" onClick={addRoleRow} className="dash-add-row-btn">
              + Add role
            </button>
          </div>

          <div>
            <div className="dash-section-label">Bio</div>
            <RichTextEditor value={bio} onChange={setBio} placeholder="A couple of sentences introducing yourself" minHeight={110} />
          </div>

          <div>
            <div className="dash-section-label">Stat tiles</div>
            <div className="dash-row-group">
              {statRows.map((row, i) => (
                <div key={i} className={`dash-row${row.enabled === false ? ' dash-row--disabled' : ''}`}>
                  <TextField
                    label="Value"
                    placeholder="5+"
                    value={row.value}
                    onChange={(e) => updateStatRow(i, { value: e.target.value })}
                    sx={{ ...fieldSx, flex: '1 1 25%' }}
                  />
                  <TextField
                    label="Label"
                    placeholder="Years Experience"
                    value={row.label}
                    onChange={(e) => updateStatRow(i, { label: e.target.value })}
                    sx={{ ...fieldSx, flex: '1 1 45%' }}
                  />
                  <TextField
                    label="Color"
                    value={row.color}
                    onChange={(e) => updateStatRow(i, { color: e.target.value })}
                    sx={{ ...fieldSx, flex: '1 1 20%' }}
                  />
                  <span className="dash-color-swatch" style={{ '--swatch-color': row.color }} />
                  <Switch
                    checked={row.enabled !== false}
                    onChange={(e) => updateStatRow(i, { enabled: e.target.checked })}
                    size="small"
                    title="Enabled — visible on the public site"
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' } }}
                  />
                  <IconButton size="small" onClick={() => requestRemove('stat', i)} sx={{ color: 'var(--accent-pink)' }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
            <button type="button" onClick={addStatRow} className="dash-add-row-btn">
              + Add stat tile
            </button>
          </div>

          <div>
            <div className="dash-section-label">Orbiting tech stack</div>
            <div className="dash-row-group">
              {techRows.map((row, i) => (
                <div key={i} className={`dash-row${row.enabled === false ? ' dash-row--disabled' : ''}`}>
                  <div className="dash-w-40">
                    <IconPicker value={row.iconKey} onChange={(e) => updateTechRow(i, { iconKey: e.target.value })} />
                  </div>
                  <TextField
                    label="Name"
                    value={row.name}
                    onChange={(e) => updateTechRow(i, { name: e.target.value })}
                    sx={{ ...fieldSx, flex: '1 1 35%' }}
                  />
                  <TextField
                    label="Color"
                    value={row.color}
                    onChange={(e) => updateTechRow(i, { color: e.target.value })}
                    sx={{ ...fieldSx, flex: '1 1 20%' }}
                  />
                  <span className="dash-color-swatch" style={{ '--swatch-color': row.color }} />
                  <Switch
                    checked={row.enabled !== false}
                    onChange={(e) => updateTechRow(i, { enabled: e.target.checked })}
                    size="small"
                    title="Enabled — visible on the public site"
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' } }}
                  />
                  <IconButton size="small" onClick={() => requestRemove('tech', i)} sx={{ color: 'var(--accent-pink)' }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
            <button type="button" onClick={addTechRow} className="dash-add-row-btn">
              + Add tech icon
            </button>
          </div>

          <div>
            <div className="dash-section-label">Resume ("Download Resume" button)</div>
            <TextField
              label="Paste a resume URL"
              fullWidth
              value={resumeUrl.startsWith('data:') ? '(uploaded file)' : resumeUrl}
              disabled={resumeUrl.startsWith('data:')}
              onChange={(e) => setResumeUrl(e.target.value)}
              sx={fieldSx}
            />
            <div className="dash-resume-row">
              <label className="dash-upload-label">
                📁 Upload PDF
                <input type="file" accept="application/pdf" onChange={handleResumeFile} className="dash-hidden-input" />
              </label>
              {resumeUrl && (
                <button
                  type="button"
                  onClick={() => setResumeUrl('')}
                  className="dash-resume-clear-btn"
                >
                  Clear (fall back to the built-in resume file)
                </button>
              )}
            </div>
            <p className="dash-hero-footnote">
              Leave empty to keep using the resume file bundled with the site
              (<code>public/Sunny-Charkhwal-Resume.pdf</code>).
            </p>
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

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Remove this item?"
        message="This only takes effect once you Save — but the row itself is gone from this form immediately."
        onConfirm={confirmRemove}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
