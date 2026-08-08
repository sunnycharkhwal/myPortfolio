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
import { createContentPreset, updateContentPreset } from '../../store/contentPresetsSlice.js'
import { isRichTextEmpty } from '../../utils/htmlToPlainText.js'
import RichTextEditor from './RichTextEditor.jsx'

const KIND_LABELS = {
  objective: 'Objective',
  step: 'Step',
  tech: 'Tech / Service',
  outcome: 'Outcome',
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

const emptyForm = { text: '', stepTitle: '', stepText: '', group: '', order: 0, enabled: true }

// `kind` is fixed for the lifetime of this dialog — chosen from ContentPresetsPanel's
// per-section "+ Add" button when creating, or inherited from editingItem when editing.
// The backend refuses to let it change on update (see contentPresetController.js), so
// this form never renders a kind picker at all. `group`, unlike kind, IS editable —
// there's no equivalent orphaning risk in reassigning which project group a preset
// belongs to. `defaultGroup` pre-fills it to whichever group tab was active in
// ContentPresetsPanel when "+ Add" was clicked, but it's just a starting value.
export default function ContentPresetFormModal({ open, kind, defaultGroup, editingItem, onClose, onSaved }) {
  const dispatch = useDispatch()
  const { mutationStatus, error } = useSelector((s) => s.contentPresets)
  const { items: categoryItems } = useSelector((s) => s.projectCategories)
  const groups = categoryItems.filter((c) => !c.parent).sort((a, b) => a.order - b.order)
  const [form, setForm] = useState(emptyForm)
  const [localError, setLocalError] = useState(null)

  const effectiveKind = editingItem?.kind || kind

  useEffect(() => {
    if (!open) return
    if (editingItem) {
      setForm({
        text: editingItem.text || '',
        stepTitle: editingItem.stepTitle || '',
        stepText: editingItem.stepText || '',
        group: editingItem.group || '',
        order: editingItem.order ?? 0,
        enabled: editingItem.enabled ?? true,
      })
    } else {
      setForm({ ...emptyForm, group: defaultGroup || '' })
    }
    setLocalError(null)
  }, [open, editingItem, defaultGroup])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.group) {
      setLocalError('Group is required')
      return
    }
    if (effectiveKind === 'step') {
      if (!form.stepTitle.trim() || isRichTextEmpty(form.stepText)) {
        setLocalError('Step title and text are required')
        return
      }
    } else if (effectiveKind === 'tech' ? !form.text.trim() : isRichTextEmpty(form.text)) {
      setLocalError('Text is required')
      return
    }
    setLocalError(null)

    const data =
      effectiveKind === 'step'
        ? { kind: 'step', group: form.group, stepTitle: form.stepTitle, stepText: form.stepText, order: Number(form.order) || 0, enabled: form.enabled }
        : { kind: effectiveKind, group: form.group, text: form.text, order: Number(form.order) || 0, enabled: form.enabled }
    // kind is only sent on create — updateContentPreset rejects it on the update path,
    // so leave it out of the body entirely when editing.
    const payload = editingItem ? { ...data, kind: undefined } : data

    const result = await dispatch(
      editingItem ? updateContentPreset({ id: editingItem._id, data: payload }) : createContentPreset(data)
    )
    if (result.meta.requestStatus === 'fulfilled') {
      onSaved(Boolean(editingItem))
    }
  }

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
        <h2 className="dash-modal-title dash-modal-title--sm">
          {editingItem ? 'Edit' : 'New'} {KIND_LABELS[effectiveKind] || 'Preset'}
        </h2>

        {(localError || (mutationStatus === 'failed' && error)) && (
          <div className="dash-alert dash-alert--error">
            {localError || error}
          </div>
        )}

        <div className="dash-field-column">
          <TextField
            select
            label="Group"
            required
            fullWidth
            value={form.group}
            onChange={(e) => setForm((f) => ({ ...f, group: e.target.value }))}
            sx={fieldSx}
            helperText="Which project group this preset can be attached from — e.g. Frontend presets never show up on a DevOps project."
          >
            {groups.map((g) => (
              <MenuItem key={g._id} value={g.slug}>
                {g.label}
                {!g.enabled && ' (disabled)'}
              </MenuItem>
            ))}
          </TextField>

          {effectiveKind === 'step' ? (
            <>
              <TextField label="Step title" required fullWidth value={form.stepTitle} onChange={set('stepTitle')} sx={fieldSx} />
              <div>
                <div className="dash-field-label">Step text</div>
                <RichTextEditor
                  value={form.stepText}
                  onChange={(html) => setForm((f) => ({ ...f, stepText: html }))}
                  placeholder="Step description"
                />
              </div>
            </>
          ) : effectiveKind === 'tech' ? (
            <TextField label="Tech / service name" required fullWidth value={form.text} onChange={set('text')} sx={fieldSx} />
          ) : (
            <div>
              <div className="dash-field-label">
                {effectiveKind === 'outcome' ? 'Outcome text' : 'Objective text'}
              </div>
              <RichTextEditor
                value={form.text}
                onChange={(html) => setForm((f) => ({ ...f, text: html }))}
                placeholder={effectiveKind === 'outcome' ? 'e.g. Deployment time reduced by 80%' : 'What does this project achieve?'}
              />
            </div>
          )}

          <TextField label="Display order" type="number" fullWidth value={form.order} onChange={set('order')} sx={fieldSx} />

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
                Enabled — when off, this is hidden from the "attach a pre-defined item" pickers
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
          {mutationStatus === 'loading' ? 'Saving…' : editingItem ? 'Save changes' : 'Create'}
        </Button>
      </form>
    </Dialog>
  )
}
