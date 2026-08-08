import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { createAchievementEntry, updateAchievementEntry } from '../../store/experienceSectionSlice.js'
import { ICON_KEYS } from '../../utils/iconRegistry.js'
import IconPicker from './IconPicker.jsx'

const emptyForm = { iconKey: ICON_KEYS[0], value: '', label: '', color: '#00d4ff', order: 0, enabled: true }

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
          {editingItem ? 'Edit Achievement' : 'New Achievement'}
        </h2>

        {(localError || (mutationStatus === 'failed' && error)) && (
          <div className="dash-alert dash-alert--error">
            {localError || error}
          </div>
        )}

        <div className="dash-field-column">
          <IconPicker value={form.iconKey} onChange={set('iconKey')} />
          <TextField label="Value (e.g. 15+)" required fullWidth value={form.value} onChange={set('value')} sx={fieldSx} />
          <TextField label="Label" required fullWidth value={form.label} onChange={set('label')} sx={fieldSx} />
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
            label={<span className="dash-switch-label">Enabled — when off, this tile is hidden from the public site</span>}
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
          {mutationStatus === 'loading' ? 'Saving…' : editingItem ? 'Save changes' : 'Create achievement'}
        </Button>
      </form>
    </Dialog>
  )
}
