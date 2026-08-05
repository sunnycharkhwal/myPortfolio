import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { createEducationEntry, updateEducationEntry } from '../../store/experienceSectionSlice.js'

const emptyForm = { degree: '', field: '', institution: '', location: '', period: '', order: 0 }

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
          {editingItem ? 'Edit Education Entry' : 'New Education Entry'}
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
