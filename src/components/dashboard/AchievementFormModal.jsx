import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { createAchievementEntry, updateAchievementEntry } from '../../store/experienceSectionSlice.js'
import { ICON_KEYS } from '../../utils/iconRegistry.js'
import IconPicker from './IconPicker.jsx'

const emptyForm = { iconKey: ICON_KEYS[0], value: '', label: '', color: '#00d4ff', order: 0 }

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

// Same Dialog chrome as WorkHistoryFormModal — a much simpler flat form.
export default function AchievementFormModal({ open, editingItem, onClose, onSaved }) {
  const dispatch = useDispatch()
  const { mutationStatus, error } = useSelector((s) => s.experienceSection.achievements)
  const [form, setForm] = useState(emptyForm)
  const [localError, setLocalError] = useState(null)

  useEffect(() => {
    if (!open) return
    if (editingItem) {
      setForm({
        iconKey: editingItem.iconKey || ICON_KEYS[0],
        value: editingItem.value || '',
        label: editingItem.label || '',
        color: editingItem.color || '#00d4ff',
        order: editingItem.order ?? 0,
      })
    } else {
      setForm(emptyForm)
    }
    setLocalError(null)
  }, [open, editingItem])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.value.trim() || !form.label.trim()) {
      setLocalError('Value and label are required')
      return
    }
    setLocalError(null)

    const data = { ...form, order: Number(form.order) || 0 }
    const result = await dispatch(
      editingItem ? updateAchievementEntry({ id: editingItem._id, data }) : createAchievementEntry(data)
    )
    if (result.meta.requestStatus === 'fulfilled') {
      onSaved(Boolean(editingItem), form.label)
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

      <form onSubmit={handleSubmit} style={{ padding: '2.25rem 2rem 2rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.5rem' }}>
          {editingItem ? 'Edit Achievement' : 'New Achievement'}
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
          <IconPicker value={form.iconKey} onChange={set('iconKey')} />
          <TextField label="Value (e.g. 15+)" required fullWidth value={form.value} onChange={set('value')} sx={fieldSx} />
          <TextField label="Label" required fullWidth value={form.label} onChange={set('label')} sx={fieldSx} />
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <TextField label="Color" fullWidth value={form.color} onChange={set('color')} sx={fieldSx} />
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: form.color,
                border: '1px solid var(--border)',
                flexShrink: 0,
              }}
            />
          </div>
          <TextField label="Display order" type="number" fullWidth value={form.order} onChange={set('order')} sx={fieldSx} />
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
          {mutationStatus === 'loading' ? 'Saving…' : editingItem ? 'Save changes' : 'Create achievement'}
        </Button>
      </form>
    </Dialog>
  )
}
