import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { createEducationEntry, updateEducationEntry } from '../../store/experienceSectionSlice.js'

const emptyForm = { degree: '', field: '', institution: '', location: '', period: '', order: 0, enabled: true }

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

// Same Dialog chrome as the other two form modals. No icon field — the public
// component keeps a single hardcoded FaGraduationCap for every education card.
export default function EducationFormModal({ open, editingItem, onClose, onSaved }) {
  const dispatch = useDispatch()
  const { mutationStatus, error } = useSelector((s) => s.experienceSection.education)
  const [form, setForm] = useState(emptyForm)
  const [localError, setLocalError] = useState(null)

  useEffect(() => {
    if (!open) return
    if (editingItem) {
      setForm({
        degree: editingItem.degree || '',
        field: editingItem.field || '',
        institution: editingItem.institution || '',
        location: editingItem.location || '',
        period: editingItem.period || '',
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
    if (!form.degree.trim() || !form.institution.trim() || !form.period.trim()) {
      setLocalError('Degree, institution, and period are required')
      return
    }
    setLocalError(null)

    const data = { ...form, order: Number(form.order) || 0 }
    const result = await dispatch(
      editingItem ? updateEducationEntry({ id: editingItem._id, data }) : createEducationEntry(data)
    )
    if (result.meta.requestStatus === 'fulfilled') {
      onSaved(Boolean(editingItem), form.degree)
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
          {editingItem ? 'Edit Education Entry' : 'New Education Entry'}
        </h2>

        {(localError || (mutationStatus === 'failed' && error)) && (
          <div className="dash-alert dash-alert--error">
            {localError || error}
          </div>
        )}

        <div className="dash-field-column">
          <TextField label="Degree" required fullWidth value={form.degree} onChange={set('degree')} sx={fieldSx} />
          <TextField label="Field of study" fullWidth value={form.field} onChange={set('field')} sx={fieldSx} />
          <TextField
            label="Institution"
            required
            fullWidth
            value={form.institution}
            onChange={set('institution')}
            sx={fieldSx}
          />
          <TextField label="Location" fullWidth value={form.location} onChange={set('location')} sx={fieldSx} />
          <TextField label="Period" required fullWidth value={form.period} onChange={set('period')} sx={fieldSx} />
          <TextField label="Display order" type="number" fullWidth value={form.order} onChange={set('order')} sx={fieldSx} />
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
