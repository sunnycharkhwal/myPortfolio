import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { createContactService, updateContactService } from '../../store/contactServicesSlice.js'

const emptyForm = { icon: '☁️', title: '', desc: '', color: '#00d4ff', order: 0, enabled: true }

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

// Same Dialog chrome as AchievementFormModal — a flat form, one field type this app
// doesn't have elsewhere: `icon` is a raw pasted emoji, not an IconPicker selection,
// matching the Contact section's original authoring convention (see ContactService.js).
export default function ContactServiceFormModal({ open, editingItem, onClose, onSaved }) {
  const dispatch = useDispatch()
  const { mutationStatus, error } = useSelector((s) => s.contactServices)
  const [form, setForm] = useState(emptyForm)
  const [localError, setLocalError] = useState(null)

  useEffect(() => {
    if (!open) return
    if (editingItem) {
      setForm({
        icon: editingItem.icon || '☁️',
        title: editingItem.title || '',
        desc: editingItem.desc || '',
        color: editingItem.color || '#00d4ff',
        order: editingItem.order ?? 0,
        enabled: editingItem.enabled ?? true,
      })
    } else {
      setForm(emptyForm)
    }
    setLocalError(null)
  }, [open, editingItem])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.icon.trim() || !form.title.trim() || !form.desc.trim()) {
      setLocalError('Icon, title, and description are required')
      return
    }
    setLocalError(null)

    const data = { ...form, order: Number(form.order) || 0 }
    const result = await dispatch(
      editingItem ? updateContactService({ id: editingItem._id, data }) : createContactService(data)
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
          {editingItem ? 'Edit Service' : 'New Service'}
        </h2>

        {(localError || (mutationStatus === 'failed' && error)) && (
          <div className="dash-alert dash-alert--error">
            {localError || error}
          </div>
        )}

        <div className="dash-field-column">
          <TextField
            label="Icon (paste an emoji)"
            required
            fullWidth
            value={form.icon}
            onChange={set('icon')}
            helperText="e.g. ☁️ 🚀 📦 🏗️ ⚛️ — shown as-is, no icon picker for this field."
            sx={fieldSx}
          />
          <TextField label="Title" required fullWidth value={form.title} onChange={set('title')} sx={fieldSx} />
          <TextField label="Description" required fullWidth multiline minRows={2} value={form.desc} onChange={set('desc')} sx={fieldSx} />
          <div className="dash-color-row">
            <TextField label="Color" fullWidth value={form.color} onChange={set('color')} sx={fieldSx} />
            <span className="dash-color-swatch" style={{ '--swatch-color': form.color }} />
          </div>
          <TextField label="Display order" type="number" fullWidth value={form.order} onChange={set('order')} sx={fieldSx} />
          <FormControlLabel
            control={
              <Switch
                checked={form.enabled}
                onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' } }}
              />
            }
            label={<span className="dash-switch-label">Enabled — when off, this card is hidden from the public site</span>}
          />
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
          {mutationStatus === 'loading' ? 'Saving…' : editingItem ? 'Save changes' : 'Create service'}
        </Button>
      </form>
    </Dialog>
  )
}
