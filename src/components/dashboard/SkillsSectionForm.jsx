import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import DeleteIcon from '@mui/icons-material/Delete'
import { fetchSkillsSectionForEdit, saveSkillsSection } from '../../store/skillsSectionSlice.js'
import { addToast } from '../../store/toastSlice.js'
import RichTextEditor from './RichTextEditor.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'

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

// The copy AROUND the Skills grid (tagline, the 3 stat tiles, the terminal footer
// line) — as opposed to the grid's own categories/technologies, which SkillsPanel's
// "Categories" view manages. Same "one settings form, one Save button" singleton shape
// as HeroPanel.jsx, right down to the shared confirm-before-delete flow for stat rows.
export default function SkillsSectionForm() {
  const dispatch = useDispatch()
  const { mutationStatus, error } = useSelector((s) => s.skillsSection)
  const [loaded, setLoaded] = useState(false)
  const [tagline, setTagline] = useState('')
  const [statRows, setStatRows] = useState([])
  const [footerCommand, setFooterCommand] = useState('')
  const [localError, setLocalError] = useState(null)
  const [deleteIndex, setDeleteIndex] = useState(null)

  useEffect(() => {
    dispatch(fetchSkillsSectionForEdit()).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        const section = action.payload || {}
        setTagline(section.tagline || '')
        setStatRows((section.stats || []).map((s) => ({ ...s, enabled: s.enabled ?? true })))
        setFooterCommand(section.footerCommand || '')
      }
      setLoaded(true)
    })
  }, [dispatch])

  const updateStatRow = (i, patch) => setStatRows((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
  const addStatRow = () => setStatRows((rows) => [...rows, { value: '', label: '', color: '#00d4ff', enabled: true }])
  const requestRemoveStat = (i) => setDeleteIndex(i)
  const confirmRemoveStat = () => {
    setStatRows((rows) => rows.filter((_, idx) => idx !== deleteIndex))
    setDeleteIndex(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError(null)

    const data = {
      tagline,
      stats: statRows.filter((s) => s.value.trim() && s.label.trim()).map((s) => ({ ...s, enabled: s.enabled !== false })),
      footerCommand,
    }

    const result = await dispatch(saveSkillsSection(data))
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(addToast({ message: 'Skills section content updated', severity: 'success' }))
    }
  }

  if (!loaded) {
    return <p className="dash-muted-text">Loading…</p>
  }

  return (
    <div className="dash-panel--narrow">
      <p className="dash-hero-intro">
        This is the copy around the Tech Stack grid — the intro tagline, the 3 stat tiles
        below it, and the terminal-style line at the very bottom. The categories/technologies
        themselves are managed from the "Categories" tab next to this one.
      </p>

      <form onSubmit={handleSubmit}>
        {(localError || (mutationStatus === 'failed' && error)) && (
          <div className="dash-alert dash-alert--error">
            {localError || error}
          </div>
        )}

        <div className="dash-field-column dash-field-column--lg">
          <div>
            <div className="dash-section-label">Tagline</div>
            <RichTextEditor value={tagline} onChange={setTagline} placeholder="Technologies I use to build..." minHeight={80} />
          </div>

          <div>
            <div className="dash-section-label">Stat tiles</div>
            <div className="dash-row-group">
              {statRows.map((row, i) => (
                <div key={i} className={`dash-row${row.enabled === false ? ' dash-row--disabled' : ''}`}>
                  <TextField
                    label="Value"
                    placeholder="39"
                    value={row.value}
                    onChange={(e) => updateStatRow(i, { value: e.target.value })}
                    sx={{ ...fieldSx, flex: '1 1 25%' }}
                  />
                  <TextField
                    label="Label"
                    placeholder="Technologies"
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
                  <IconButton size="small" onClick={() => requestRemoveStat(i)} sx={{ color: 'var(--accent-pink)' }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
            <button type="button" onClick={addStatRow} className="dash-add-row-btn">
              + Add stat tile
            </button>
          </div>

          <TextField
            label="Footer command"
            fullWidth
            value={footerCommand}
            onChange={(e) => setFooterCommand(e.target.value)}
            helperText='Shown as "$ <this> ▌" at the bottom of the section.'
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

      <ConfirmDialog
        open={deleteIndex !== null}
        title="Remove this stat tile?"
        message="This only takes effect once you Save — but the row itself is gone from this form immediately."
        onConfirm={confirmRemoveStat}
        onCancel={() => setDeleteIndex(null)}
      />
    </div>
  )
}
