import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { createProjectCategory, updateProjectCategory } from '../../store/projectCategoriesSlice.js'
import IconPicker from './IconPicker.jsx'

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

function slugify(label) {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const emptyForm = { label: '', slug: '', iconKey: 'FaCode', color: '#00d4ff', order: 0, enabled: true }

// Handles both levels of the taxonomy — a "group" (parent: null) when opened via
// "+ New Group", or a "sub-category" (parent: <group id>) when opened via a group's
// "+ New Sub-category" button. `lockedParent`/`lockedParentLabel` come from
// ProjectCategoriesPanel so the parent isn't editable once you're already inside a
// specific group's "add sub-category" flow — same Dialog chrome as ProjectFormModal.jsx.
export default function ProjectCategoryFormModal({ open, editingItem, lockedParent, lockedParentLabel, onClose, onSaved }) {
  const dispatch = useDispatch()
  const { mutationStatus, error } = useSelector((s) => s.projectCategories)
  const [form, setForm] = useState(emptyForm)
  const [slugTouched, setSlugTouched] = useState(false)
  const [localError, setLocalError] = useState(null)

  useEffect(() => {
    if (!open) return
    if (editingItem) {
      setForm({
        label: editingItem.label || '',
        slug: editingItem.slug || '',
        iconKey: editingItem.iconKey || 'FaCode',
        color: editingItem.color || '#00d4ff',
        order: editingItem.order ?? 0,
        enabled: editingItem.enabled ?? true,
      })
      setSlugTouched(true)
    } else {
      setForm(emptyForm)
      setSlugTouched(false)
    }
    setLocalError(null)
  }, [open, editingItem])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleLabelChange = (e) => {
    const label = e.target.value
    setForm((f) => ({ ...f, label, slug: slugTouched ? f.slug : slugify(label) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.label.trim()) {
      setLocalError('Label is required')
      return
    }
    if (!form.slug.trim()) {
      setLocalError('Slug is required')
      return
    }
    setLocalError(null)

    const data = {
      label: form.label.trim(),
      slug: form.slug.trim(),
      iconKey: form.iconKey,
      color: form.color,
      order: Number(form.order) || 0,
      enabled: form.enabled,
      parent: editingItem ? editingItem.parent ?? null : lockedParent ?? null,
    }

    const result = await dispatch(
      editingItem ? updateProjectCategory({ id: editingItem._id, data }) : createProjectCategory(data)
    )
    if (result.meta.requestStatus === 'fulfilled') {
      onSaved(Boolean(editingItem), form.label, Boolean(data.parent))
    }
  }

  const isSubcategory = editingItem ? Boolean(editingItem.parent) : Boolean(lockedParent)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
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
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.3rem' }}>
          {editingItem ? 'Edit' : 'New'} {isSubcategory ? 'Sub-category' : 'Group'}
        </h2>
        {isSubcategory && (lockedParentLabel || editingItem?.parentLabel) && (
          <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: '1rem' }}>
            Under: {lockedParentLabel || editingItem?.parentLabel}
          </p>
        )}
        {!isSubcategory && <div style={{ marginBottom: '1rem' }} />}

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
          <TextField label="Label" required fullWidth value={form.label} onChange={handleLabelChange} sx={fieldSx} />
          <TextField
            label="Slug"
            required
            fullWidth
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true)
              set('slug')(e)
            }}
            helperText="Stored on projects — avoid changing once in use."
            sx={fieldSx}
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <IconPicker value={form.iconKey} onChange={set('iconKey')} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Color</label>
              <input
                type="color"
                value={form.color}
                onChange={set('color')}
                style={{ width: 48, height: 40, borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}
              />
            </div>
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
            label={<span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Enabled (visible on the public site)</span>}
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
          {mutationStatus === 'loading' ? 'Saving…' : editingItem ? 'Save changes' : 'Create'}
        </Button>
      </form>
    </Dialog>
  )
}
