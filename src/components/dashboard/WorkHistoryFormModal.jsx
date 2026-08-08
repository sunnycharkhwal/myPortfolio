import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Button from '@mui/material/Button'
import { createWorkHistoryEntry, updateWorkHistoryEntry } from '../../store/experienceSectionSlice.js'
import { ICON_KEYS } from '../../utils/iconRegistry.js'
import IconPicker from './IconPicker.jsx'

const emptyForm = {
  title: '',
  company: '',
  location: '',
  period: '',
  current: false,
  order: 0,
  points: '',
  enabled: true,
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

// Visual chrome copied from ProjectFormModal.jsx (itself copied from ProjectModal in
// src/components/Projects.jsx) — gradient hairline, blurred backdrop, 24px radius,
// top-right close. The most complex form in the dashboard: a repeatable tech[] row
// editor (icon + name + color per row) alongside the flat fields.
export default function WorkHistoryFormModal({ open, editingItem, onClose, onSaved }) {
  const dispatch = useDispatch()
  const { mutationStatus, error } = useSelector((s) => s.experienceSection.workHistory)
  const [form, setForm] = useState(emptyForm)
  const [techRows, setTechRows] = useState([])
  const [localError, setLocalError] = useState(null)

  useEffect(() => {
    if (!open) return
    if (editingItem) {
      setForm({
        title: editingItem.title || '',
        company: editingItem.company || '',
        location: editingItem.location || '',
        period: editingItem.period || '',
        current: Boolean(editingItem.current),
        order: editingItem.order ?? 0,
        points: (editingItem.points || []).join('\n'),
        enabled: editingItem.enabled ?? true,
      })
      setTechRows((editingItem.tech || []).map((t) => ({ ...t })))
    } else {
      setForm(emptyForm)
      setTechRows([])
    }
    setLocalError(null)
  }, [open, editingItem])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const updateTechRow = (index, patch) => {
    setTechRows((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }
  const addTechRow = () => {
    setTechRows((rows) => [...rows, { iconKey: ICON_KEYS[0], name: '', color: '#ffffff' }])
  }
  const removeTechRow = (index) => {
    setTechRows((rows) => rows.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.company.trim() || !form.period.trim()) {
      setLocalError('Title, company, and period are required')
      return
    }
    setLocalError(null)

    const data = {
      title: form.title,
      company: form.company,
      location: form.location,
      period: form.period,
      current: form.current,
      order: Number(form.order) || 0,
      points: form.points.split('\n').map((p) => p.trim()).filter(Boolean),
      tech: techRows,
      enabled: form.enabled,
    }

    const result = await dispatch(
      editingItem ? updateWorkHistoryEntry({ id: editingItem._id, data }) : createWorkHistoryEntry(data)
    )
    if (result.meta.requestStatus === 'fulfilled') {
      onSaved(Boolean(editingItem), form.title)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            position: 'relative',
            background: 'linear-gradient(180deg, rgba(25, 25, 35, 0.98) 0%, rgba(15, 15, 22, 0.99) 100%)',
            backgroundImage: 'none',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
          },
        },
        backdrop: {
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px) saturate(180%)' },
        },
      }}
    >
      <div className="dash-modal-hairline" />
      <IconButton
        onClick={onClose}
        aria-label="Close"
        sx={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          zIndex: 10,
          color: 'var(--text-secondary)',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border)',
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <form onSubmit={handleSubmit} className="dash-modal-form">
        <h2 className="dash-modal-title">
          {editingItem ? 'Edit Work History Entry' : 'New Work History Entry'}
        </h2>

        {(localError || (mutationStatus === 'failed' && error)) && (
          <div className="dash-alert dash-alert--error">
            {localError || error}
          </div>
        )}

        <div className="dash-field-column">
          <TextField label="Title" required fullWidth value={form.title} onChange={set('title')} sx={fieldSx} />
          <TextField label="Company" required fullWidth value={form.company} onChange={set('company')} sx={fieldSx} />
          <TextField label="Location" fullWidth value={form.location} onChange={set('location')} sx={fieldSx} />
          <TextField
            label="Period (e.g. Dec 2024 – Present)"
            required
            fullWidth
            value={form.period}
            onChange={set('period')}
            sx={fieldSx}
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.current}
                onChange={(e) => setForm((f) => ({ ...f, current: e.target.checked }))}
              />
            }
            label="Current role"
            sx={{ color: 'var(--text-secondary)' }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.enabled}
                onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' } }}
              />
            }
            label={<span className="dash-switch-label">Enabled — when off, this entry is hidden from the public site</span>}
          />
          <TextField
            label="Display order"
            type="number"
            fullWidth
            value={form.order}
            onChange={set('order')}
            sx={fieldSx}
          />
          <TextField
            label="Points (one per line)"
            multiline
            minRows={3}
            fullWidth
            value={form.points}
            onChange={set('points')}
            sx={fieldSx}
          />

          <div>
            <div className="dash-section-label">
              Tech stack
            </div>
            <div className="dash-row-group">
              {techRows.map((row, i) => (
                <div key={i} className="dash-row">
                  <div className="dash-w-40">
                    <IconPicker value={row.iconKey} onChange={(e) => updateTechRow(i, { iconKey: e.target.value })} />
                  </div>
                  <TextField
                    label="Name"
                    value={row.name}
                    onChange={(e) => updateTechRow(i, { name: e.target.value })}
                    sx={{ ...fieldSx, flex: '1 1 30%' }}
                  />
                  <TextField
                    label="Color"
                    value={row.color}
                    onChange={(e) => updateTechRow(i, { color: e.target.value })}
                    sx={{ ...fieldSx, flex: '1 1 20%' }}
                  />
                  <span className="dash-color-swatch" style={{ '--swatch-color': row.color }} />
                  <IconButton size="small" onClick={() => removeTechRow(i)} sx={{ color: 'var(--accent-pink)' }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
            <button type="button" onClick={addTechRow} className="dash-add-row-btn">
              + Add technology
            </button>
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={mutationStatus === 'loading'}
          sx={{
            marginTop: '1.5rem',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '50px',
            padding: '12px 0',
            background: 'var(--gradient-1)',
            color: '#0a0a0f',
            '&:hover': { background: 'var(--gradient-1)', opacity: 0.9 },
          }}
        >
          {mutationStatus === 'loading' ? 'Saving…' : editingItem ? 'Save changes' : 'Create entry'}
        </Button>
      </form>
    </Dialog>
  )
}
