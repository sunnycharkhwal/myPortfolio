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
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.5), rgba(168, 85, 247, 0.5), transparent)',
        }}
      />
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

      <form onSubmit={handleSubmit} style={{ padding: '2.25rem 2rem 2rem', maxHeight: '85vh', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.5rem' }}>
          {editingItem ? 'Edit Work History Entry' : 'New Work History Entry'}
        </h2>

        {(localError || (mutationStatus === 'failed' && error)) && (
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
            {localError || error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Tech stack
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {techRows.map((row, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ flex: '1 1 40%' }}>
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
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: row.color,
                      border: '1px solid var(--border)',
                      flexShrink: 0,
                    }}
                  />
                  <IconButton size="small" onClick={() => removeTechRow(i)} sx={{ color: 'var(--accent-pink)' }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addTechRow}
              style={{
                marginTop: 10,
                background: 'none',
                border: '1px dashed var(--border)',
                borderRadius: 8,
                padding: '8px 14px',
                color: 'var(--accent)',
                fontSize: 12.5,
                cursor: 'pointer',
                width: '100%',
              }}
            >
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
