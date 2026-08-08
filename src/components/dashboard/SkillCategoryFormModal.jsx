import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { createSkillCategory, updateSkillCategory } from '../../store/skillsSlice.js'
import { ICON_KEYS } from '../../utils/iconRegistry.js'
import IconPicker from './IconPicker.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'

const emptyForm = { title: '', iconKey: ICON_KEYS[0], color: '#00d4ff', order: 0, enabled: true }

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

// Same Dialog chrome as AchievementFormModal, plus a repeatable tag-row editor (each
// row: icon + name + its own enable switch + confirm-before-delete) — matching
// HeroPanel.jsx's stat/tech-icon rows, since a category's tags are the exact same
// "individually enable-able, individually removable" shape as Hero's subdocs.
export default function SkillCategoryFormModal({ open, editingItem, onClose, onSaved }) {
  const dispatch = useDispatch()
  const { mutationStatus, error } = useSelector((s) => s.skills)
  const [form, setForm] = useState(emptyForm)
  const [tagRows, setTagRows] = useState([])
  const [localError, setLocalError] = useState(null)
  // Confirm-before-delete for a single tag row — separate from SkillsPanel's own
  // confirm-before-delete for the whole category, same split HeroPanel uses between its
  // own row-level ConfirmDialog and nothing above it (there's no "delete Hero" action).
  const [tagDeleteIndex, setTagDeleteIndex] = useState(null)

  useEffect(() => {
    if (!open) return
    if (editingItem) {
      setForm({
        title: editingItem.title || '',
        iconKey: editingItem.iconKey || ICON_KEYS[0],
        color: editingItem.color || '#00d4ff',
        order: editingItem.order ?? 0,
        enabled: editingItem.enabled ?? true,
      })
      setTagRows((editingItem.tags || []).map((t) => ({ ...t, enabled: t.enabled ?? true })))
    } else {
      setForm(emptyForm)
      setTagRows([])
    }
    setLocalError(null)
    setTagDeleteIndex(null)
  }, [open, editingItem])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const updateTagRow = (i, patch) => setTagRows((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
  const addTagRow = () => setTagRows((rows) => [...rows, { iconKey: ICON_KEYS[0], name: '', enabled: true }])
  const requestRemoveTag = (i) => setTagDeleteIndex(i)
  const confirmRemoveTag = () => {
    setTagRows((rows) => rows.filter((_, idx) => idx !== tagDeleteIndex))
    setTagDeleteIndex(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setLocalError('Title is required')
      return
    }
    setLocalError(null)

    const data = {
      title: form.title,
      iconKey: form.iconKey,
      color: form.color,
      order: Number(form.order) || 0,
      enabled: form.enabled,
      tags: tagRows.filter((t) => t.name.trim()).map((t) => ({ ...t, enabled: t.enabled !== false })),
    }

    const result = await dispatch(
      editingItem ? updateSkillCategory({ id: editingItem._id, data }) : createSkillCategory(data)
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
          {editingItem ? 'Edit Skill Category' : 'New Skill Category'}
        </h2>

        {(localError || (mutationStatus === 'failed' && error)) && (
          <div className="dash-alert dash-alert--error">
            {localError || error}
          </div>
        )}

        <div className="dash-field-column">
          <TextField label="Title (e.g. Cloud)" required fullWidth value={form.title} onChange={set('title')} sx={fieldSx} />
          <IconPicker value={form.iconKey} onChange={set('iconKey')} />
          <div className="dash-color-row">
            <TextField label="Color" fullWidth value={form.color} onChange={set('color')} sx={fieldSx} />
            <span className="dash-color-swatch" style={{ '--swatch-color': form.color }} />
          </div>

          <div>
            <div className="dash-section-label">Technologies</div>
            <div className="dash-row-group">
              {tagRows.map((row, i) => (
                <div key={i} className={`dash-row${row.enabled === false ? ' dash-row--disabled' : ''}`}>
                  <div className="dash-w-40">
                    <IconPicker value={row.iconKey} onChange={(e) => updateTagRow(i, { iconKey: e.target.value })} />
                  </div>
                  <TextField
                    label="Name"
                    value={row.name}
                    onChange={(e) => updateTagRow(i, { name: e.target.value })}
                    sx={{ ...fieldSx, flex: '1 1 45%' }}
                  />
                  <Switch
                    checked={row.enabled !== false}
                    onChange={(e) => updateTagRow(i, { enabled: e.target.checked })}
                    size="small"
                    title="Enabled — visible on the public site"
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' } }}
                  />
                  <IconButton size="small" onClick={() => requestRemoveTag(i)} sx={{ color: 'var(--accent-pink)' }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
            <button type="button" onClick={addTagRow} className="dash-add-row-btn">
              + Add technology
            </button>
          </div>

          <TextField
            label="Display order"
            type="number"
            fullWidth
            value={form.order}
            onChange={set('order')}
            helperText="Also settable by dragging the card in the list behind this form."
            sx={fieldSx}
          />

          <FormControlLabel
            control={
              <Switch
                checked={form.enabled}
                onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' } }}
              />
            }
            label={
              <span className="dash-switch-label">
                Enabled — when off, this{' '}
                <strong className="dash-switch-label__strong">entire category is hidden</strong> from the public site
              </span>
            }
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
          {mutationStatus === 'loading' ? 'Saving…' : editingItem ? 'Save changes' : 'Create category'}
        </Button>
      </form>

      <ConfirmDialog
        open={tagDeleteIndex !== null}
        title="Remove this technology?"
        message="This only takes effect once you Save — but the row itself is gone from this form immediately."
        onConfirm={confirmRemoveTag}
        onCancel={() => setTagDeleteIndex(null)}
      />
    </Dialog>
  )
}
