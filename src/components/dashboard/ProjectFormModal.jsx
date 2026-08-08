import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { createProject, updateProject } from '../../store/projectsSlice.js'
import { fetchContentPresets } from '../../store/contentPresetsSlice.js'
import { fileToDataUrl } from '../../utils/fileToDataUrl.js'
import { htmlToPlainText, isRichTextEmpty } from '../../utils/htmlToPlainText.js'
import RichTextEditor from './RichTextEditor.jsx'

// Files larger than this are rejected client-side with an inline message rather than
// silently bloating the Mongo document — there's no real object storage behind this
// (base64 data-URIs are stored directly on the project), so this is a soft safety net,
// not a hard system limit.
const MAX_UPLOAD_BYTES = 3 * 1024 * 1024

const emptyForm = {
  title: '',
  subtitle: '',
  group: 'devops',
  category: '',
  objective: '',
  techOrAws: '',
  order: 0,
  enabled: true,
  link: '',
  linkEnabled: true,
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

function toDisplayList(arr) {
  return (arr || []).join(', ')
}

// Visual chrome copied from the original ProjectFormModal (itself copied from
// ProjectModal in src/components/Projects.jsx). The most complex form in the
// dashboard: group/category selects are sourced from the admin-manageable
// projectCategoriesSlice (see ProjectCategoriesPanel.jsx for CRUD), techStack vs aws
// swap based on the chosen group, and `steps` is a repeatable title+text row editor.
export default function ProjectFormModal({ open, editingItem, onClose, onSaved }) {
  const dispatch = useDispatch()
  const { mutationStatus, error } = useSelector((s) => s.projects)
  // Manage list (enabled + disabled) — already loaded by ProjectsPanel before this
  // modal can even open. Disabled entries stay selectable here (labeled "(disabled)")
  // so editing a project that already uses one doesn't get stuck.
  const { items: categoryItems } = useSelector((s) => s.projectCategories)
  const groups = categoryItems.filter((c) => !c.parent).sort((a, b) => a.order - b.order)
  const { items: presetItems } = useSelector((s) => s.contentPresets)
  const [form, setForm] = useState(emptyForm)
  // "Attach a pre-defined item" library — one flat fetch, filtered client-side by kind,
  // enabled-ness, AND the project's currently-selected group (form.group) — a Frontend
  // project only ever offers Frontend-tagged presets, never DevOps ones, so switching
  // Group in the form above live-updates every picker below it. Picking one from any of
  // the pickers copies its text/rows into the form fields, which stay fully editable
  // afterward — never a locked reference back to the preset. Declared after `form`
  // since it reads form.group.
  const enabledPresets = (kind) => presetItems.filter((p) => p.kind === kind && p.enabled && p.group === form.group)
  const objectivePresets = enabledPresets('objective')
  const stepPresets = enabledPresets('step')
  const techPresets = enabledPresets('tech')
  const outcomePresets = enabledPresets('outcome')
  const [stepRows, setStepRows] = useState([])
  // Each entry is an HTML string (RichTextEditor's native format), not a plain-text
  // line — replaced the old single "one per line" textarea with repeatable rows
  // (same pattern as stepRows) once each outcome could hold real formatting, since a
  // single big rich-text blob has no reliable way to split back into an array on save.
  const [outcomeRows, setOutcomeRows] = useState([])
  const [imageList, setImageList] = useState([])
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [downloadRows, setDownloadRows] = useState([])
  const [localError, setLocalError] = useState(null)

  useEffect(() => {
    if (!open) return
    if (editingItem) {
      setForm({
        title: editingItem.title || '',
        subtitle: editingItem.subtitle || '',
        group: editingItem.group || 'devops',
        category: editingItem.category || '',
        objective: editingItem.objective || '',
        techOrAws: toDisplayList(editingItem.group === 'frontend' ? editingItem.techStack : editingItem.aws),
        order: editingItem.order ?? 0,
        enabled: editingItem.enabled ?? true,
        link: editingItem.link || '',
        linkEnabled: editingItem.linkEnabled ?? true,
      })
      setStepRows((editingItem.steps || []).map((s) => ({ ...s })))
      setOutcomeRows([...(editingItem.outcomes || [])])
      setImageList([...(editingItem.images || [])])
      setDownloadRows((editingItem.downloads || []).map((d) => ({ ...d })))
    } else {
      setForm(emptyForm)
      // Pre-seed one empty row each — an existing project always has at least one step/
      // outcome already, so its editors are visible the instant the modal opens; a brand
      // new project had zero rows and therefore showed no rich-text editor at all until
      // "+ Add step"/"+ Add outcome" was clicked. Starting with one empty row makes New
      // Project open to the same visible state as Edit Project. Still fully removable —
      // this isn't a hidden minimum, submit still requires at least one real outcome.
      setStepRows([{ title: '', text: '' }])
      setOutcomeRows([''])
      setImageList([])
      setDownloadRows([])
    }
    setImageUrlInput('')
    setLocalError(null)
  }, [open, editingItem])

  useEffect(() => {
    dispatch(fetchContentPresets())
  }, [dispatch])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  // Every picker below resets its own select back to the placeholder immediately after
  // firing (value stays '') — they're one-shot "insert" actions, not a persistent
  // selection, so re-picking the same preset twice (e.g. to add it again) just works.
  const insertObjectivePreset = (e) => {
    const preset = objectivePresets.find((p) => p._id === e.target.value)
    if (!preset) return
    // Both sides are HTML fragments (RichTextEditor's native format) — concatenating
    // them is valid HTML (two adjacent block elements), unlike the old plain-text
    // version which needed an explicit "\n\n" separator.
    setForm((f) => ({ ...f, objective: isRichTextEmpty(f.objective) ? preset.text : f.objective + preset.text }))
  }
  const addStepPreset = (e) => {
    const preset = stepPresets.find((p) => p._id === e.target.value)
    if (!preset) return
    setStepRows((rows) => [...rows, { title: preset.stepTitle, text: preset.stepText }])
  }
  const addTechPreset = (e) => {
    const preset = techPresets.find((p) => p._id === e.target.value)
    if (!preset) return
    const current = form.techOrAws.split(',').map((s) => s.trim()).filter(Boolean)
    if (current.includes(preset.text)) return
    setForm((f) => ({ ...f, techOrAws: [...current, preset.text].join(', ') }))
  }
  // Adds a whole new outcome row pre-filled from the preset, rather than appending into
  // an existing one — outcomes are a list of separate items (each gets its own
  // checkmark on the public site), not one shared block of text.
  const addOutcomePreset = (e) => {
    const preset = outcomePresets.find((p) => p._id === e.target.value)
    if (!preset) return
    setOutcomeRows((rows) => [...rows, preset.text])
  }

  const updateOutcomeRow = (index, html) => {
    setOutcomeRows((rows) => rows.map((row, i) => (i === index ? html : row)))
  }
  const addOutcomeRow = () => setOutcomeRows((rows) => [...rows, ''])
  const removeOutcomeRow = (index) => setOutcomeRows((rows) => rows.filter((_, i) => i !== index))

  const handleGroupChange = (e) => {
    // Changing group invalidates the previously-selected category (categories are
    // group-specific) and the techStack/aws field means something different now.
    setForm((f) => ({ ...f, group: e.target.value, category: '', techOrAws: '' }))
  }

  const handleCategoryChange = (e) => {
    setForm((f) => ({ ...f, category: e.target.value }))
  }

  const updateStepRow = (index, patch) => {
    setStepRows((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }
  const addStepRow = () => setStepRows((rows) => [...rows, { title: '', text: '' }])
  const removeStepRow = (index) => setStepRows((rows) => rows.filter((_, i) => i !== index))

  // Images can come from either input — pasted URL(s) or an uploaded file read into a
  // base64 data-URI (see fileToDataUrl.js) — both just become plain strings appended to
  // the same imageList, and both render identically in the thumbnail preview below via
  // a plain <img src>.
  const handleAddImageUrls = () => {
    const urls = imageUrlInput.split(',').map((s) => s.trim()).filter(Boolean)
    if (urls.length === 0) return
    setImageList((list) => [...list, ...urls])
    setImageUrlInput('')
  }
  const handleImageFiles = async (e) => {
    const files = Array.from(e.target.files || [])
    e.target.value = '' // allow re-selecting the same file later
    if (files.length === 0) return
    const tooBig = files.filter((f) => f.size > MAX_UPLOAD_BYTES)
    if (tooBig.length > 0) {
      setLocalError(`"${tooBig[0].name}" is too large (max 3MB per image) — skipped.`)
    }
    const okFiles = files.filter((f) => f.size <= MAX_UPLOAD_BYTES)
    const dataUrls = await Promise.all(okFiles.map(fileToDataUrl))
    setImageList((list) => [...list, ...dataUrls])
  }
  const removeImage = (index) => setImageList((list) => list.filter((_, i) => i !== index))

  const updateDownloadRow = (index, patch) => {
    setDownloadRows((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }
  const addDownloadRow = () => setDownloadRows((rows) => [...rows, { label: '', url: '' }])
  const removeDownloadRow = (index) => setDownloadRows((rows) => rows.filter((_, i) => i !== index))
  const handleDownloadFileUpload = async (index, e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (file.size > MAX_UPLOAD_BYTES) {
      setLocalError(`"${file.name}" is too large (max 3MB) — skipped.`)
      return
    }
    const dataUrl = await fileToDataUrl(file)
    updateDownloadRow(index, { url: dataUrl, label: downloadRows[index]?.label || file.name })
  }

  const activeGroup = groups.find((g) => g.slug === form.group)
  const visibleCategories = activeGroup
    ? categoryItems.filter((c) => c.parent === activeGroup._id).sort((a, b) => a.order - b.order)
    : []

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.subtitle.trim()) {
      setLocalError('Title and subtitle are required')
      return
    }
    if (!form.category) {
      setLocalError('Category is required')
      return
    }
    if (imageList.length === 0) {
      setLocalError('At least one image (URL or upload) is required')
      return
    }
    const outcomes = outcomeRows.filter((html) => !isRichTextEmpty(html))
    if (outcomes.length === 0) {
      setLocalError('At least one outcome is required')
      return
    }
    setLocalError(null)

    const category = visibleCategories.find((c) => c.slug === form.category)
    const techOrAwsList = form.techOrAws.split(',').map((s) => s.trim()).filter(Boolean)

    const downloads = downloadRows.filter((r) => r.label?.trim() && r.url?.trim())

    const data = {
      title: form.title,
      subtitle: form.subtitle,
      group: form.group,
      category: form.category,
      catLabel: category?.label || form.category,
      images: imageList,
      objective: form.objective,
      steps: stepRows,
      outcomes,
      order: Number(form.order) || 0,
      enabled: form.enabled,
      link: form.link.trim(),
      linkEnabled: form.linkEnabled,
      downloads,
      ...(form.group === 'frontend' ? { techStack: techOrAwsList } : { aws: techOrAwsList }),
    }

    const result = await dispatch(
      editingItem ? updateProject({ id: editingItem._id, data }) : createProject(data)
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
          {editingItem ? 'Edit Project' : 'New Project'}
        </h2>

        {(localError || (mutationStatus === 'failed' && error)) && (
          <div className="dash-alert dash-alert--error">
            {localError || error}
          </div>
        )}

        <div className="dash-field-column">
          <TextField label="Title" required fullWidth value={form.title} onChange={set('title')} sx={fieldSx} />
          <TextField label="Subtitle" required fullWidth value={form.subtitle} onChange={set('subtitle')} sx={fieldSx} />

          <div className="dash-field-row">
            <TextField select label="Group" fullWidth value={form.group} onChange={handleGroupChange} sx={fieldSx}>
              {groups.map((g) => (
                <MenuItem key={g._id} value={g.slug}>
                  {g.label}{!g.enabled && ' (disabled)'}
                </MenuItem>
              ))}
            </TextField>
            <TextField select label="Category" required fullWidth value={form.category} onChange={handleCategoryChange} sx={fieldSx}>
              {visibleCategories.map((c) => (
                <MenuItem key={c._id} value={c.slug}>
                  {c.label}{!c.enabled && ' (disabled)'}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <div>
            <div className="dash-section-label">
              Images {imageList.length === 0 && <span className="dash-required-asterisk">*</span>}
            </div>
            <div className="dash-row">
              <TextField
                label="Paste image URL(s), comma separated"
                fullWidth
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddImageUrls()
                  }
                }}
                sx={fieldSx}
              />
              <Button
                type="button"
                onClick={handleAddImageUrls}
                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 10, color: 'var(--accent)', border: '1px solid var(--border)', whiteSpace: 'nowrap' }}
              >
                Add
              </Button>
            </div>
            <label className="dash-upload-label">
              📁 Upload image file(s)
              <input type="file" accept="image/*" multiple onChange={handleImageFiles} className="dash-hidden-input" />
            </label>

            {imageList.length > 0 && (
              <div className="dash-image-grid">
                {imageList.map((src, i) => (
                  <div key={i} className="dash-image-thumb">
                    <img
                      src={src}
                      alt={`Preview ${i + 1}`}
                      className="dash-image-thumb__img"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      aria-label={`Remove image ${i + 1}`}
                      className="dash-image-thumb__remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="dash-section-label">
              Objective
            </div>
            <RichTextEditor
              value={form.objective}
              onChange={(html) => setForm((f) => ({ ...f, objective: html }))}
              placeholder="What does this project achieve?"
            />
          </div>
          {objectivePresets.length > 0 && (
            <TextField
              select
              label="+ Insert from library"
              value=""
              onChange={insertObjectivePreset}
              size="small"
              sx={{ ...fieldSx, maxWidth: 280 }}
            >
              {objectivePresets.map((p) => {
                const preview = htmlToPlainText(p.text)
                return (
                  <MenuItem key={p._id} value={p._id} sx={{ whiteSpace: 'normal' }}>
                    {preview.length > 70 ? `${preview.slice(0, 70)}…` : preview}
                  </MenuItem>
                )
              })}
            </TextField>
          )}

          <div>
            <div className="dash-section-label">
              Architecture & Steps
            </div>
            <div className="dash-row-group">
              {stepRows.map((row, i) => (
                <div key={i} className="dash-row dash-row--top">
                  <TextField
                    label={`Step ${i + 1} title`}
                    value={row.title}
                    onChange={(e) => updateStepRow(i, { title: e.target.value })}
                    sx={{ ...fieldSx, flex: '1 1 35%' }}
                  />
                  <div className="dash-w-55">
                    <RichTextEditor
                      value={row.text}
                      onChange={(html) => updateStepRow(i, { text: html })}
                      placeholder="Step description"
                      minHeight={56}
                    />
                  </div>
                  <IconButton size="small" onClick={() => removeStepRow(i)} sx={{ color: 'var(--accent-pink)', marginTop: 1 }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
            <div className="dash-add-row-line">
              <button type="button" onClick={addStepRow} className="dash-add-row-btn dash-add-row-btn--inline">
                + Add step
              </button>
              {stepPresets.length > 0 && (
                <TextField
                  select
                  label="+ Add from library"
                  value=""
                  onChange={addStepPreset}
                  size="small"
                  sx={{ ...fieldSx, flex: 1 }}
                >
                  {stepPresets.map((p) => (
                    <MenuItem key={p._id} value={p._id}>
                      {p.stepTitle}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </div>
          </div>

          <TextField
            label={form.group === 'frontend' ? 'Tech stack (comma separated)' : 'AWS services (comma separated)'}
            fullWidth
            value={form.techOrAws}
            onChange={set('techOrAws')}
            sx={fieldSx}
          />
          {techPresets.length > 0 && (
            <TextField
              select
              label="+ Add from library"
              value=""
              onChange={addTechPreset}
              size="small"
              sx={{ ...fieldSx, maxWidth: 280 }}
            >
              {techPresets.map((p) => (
                <MenuItem key={p._id} value={p._id}>
                  {p.text}
                </MenuItem>
              ))}
            </TextField>
          )}

          <div>
            <div className="dash-section-label">
              Key Outcomes {outcomeRows.every(isRichTextEmpty) && <span className="dash-required-asterisk">*</span>}
            </div>
            <div className="dash-row-group">
              {outcomeRows.map((html, i) => (
                <div key={i} className="dash-row dash-row--top">
                  <div className="dash-flex-1">
                    <RichTextEditor value={html} onChange={(next) => updateOutcomeRow(i, next)} placeholder={`Outcome ${i + 1}`} minHeight={56} />
                  </div>
                  <IconButton size="small" onClick={() => removeOutcomeRow(i)} sx={{ color: 'var(--accent-pink)', marginTop: 1 }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
            <div className="dash-add-row-line">
              <button type="button" onClick={addOutcomeRow} className="dash-add-row-btn dash-add-row-btn--inline">
                + Add outcome
              </button>
              {outcomePresets.length > 0 && (
                <TextField
                  select
                  label="+ Add from library"
                  value=""
                  onChange={addOutcomePreset}
                  size="small"
                  sx={{ ...fieldSx, flex: 1 }}
                >
                  {outcomePresets.map((p) => {
                    const preview = htmlToPlainText(p.text)
                    return (
                      <MenuItem key={p._id} value={p._id} sx={{ whiteSpace: 'normal' }}>
                        {preview.length > 70 ? `${preview.slice(0, 70)}…` : preview}
                      </MenuItem>
                    )
                  })}
                </TextField>
              )}
            </div>
          </div>

          <TextField
            label="Display order"
            type="number"
            fullWidth
            value={form.order}
            onChange={set('order')}
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
                <strong className="dash-switch-label__strong">entire project is hidden</strong> from the public site
              </span>
            }
          />

          <div>
            <TextField
              label="Project link (optional — e.g. live site or repo URL)"
              fullWidth
              value={form.link}
              onChange={set('link')}
              sx={fieldSx}
            />
            <FormControlLabel
              sx={{ marginTop: 0.5 }}
              control={
                <Switch
                  checked={form.linkEnabled}
                  onChange={(e) => setForm((f) => ({ ...f, linkEnabled: e.target.checked }))}
                  sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' } }}
                />
              }
              label={
                <span className="dash-switch-label">
                  Link enabled — shows the "Visit Project" button (only relevant if you filled in a link above)
                </span>
              }
            />
          </div>

          <div>
            <div className="dash-section-label">
              Download Buttons (in addition to the auto-generated case study PDF)
            </div>
            <div className="dash-row-group">
              {downloadRows.map((row, i) => (
                <div key={i} className="dash-row dash-row--top">
                  <TextField
                    label="Button label"
                    value={row.label}
                    onChange={(e) => updateDownloadRow(i, { label: e.target.value })}
                    sx={{ ...fieldSx, flex: '1 1 30%' }}
                  />
                  <TextField
                    label="URL"
                    value={row.url?.startsWith('data:') ? '(uploaded file)' : row.url}
                    disabled={row.url?.startsWith('data:')}
                    onChange={(e) => updateDownloadRow(i, { url: e.target.value })}
                    sx={{ ...fieldSx, flex: '1 1 40%' }}
                  />
                  <label className="dash-upload-label dash-upload-label--compact">
                    📁 Upload
                    <input type="file" onChange={(e) => handleDownloadFileUpload(i, e)} className="dash-hidden-input" />
                  </label>
                  <IconButton size="small" onClick={() => removeDownloadRow(i)} sx={{ color: 'var(--accent-pink)', marginTop: 1 }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
            <button type="button" onClick={addDownloadRow} className="dash-add-row-btn">
              + Add download button
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
          {mutationStatus === 'loading' ? 'Saving…' : editingItem ? 'Save changes' : 'Create project'}
        </Button>
      </form>
    </Dialog>
  )
}
