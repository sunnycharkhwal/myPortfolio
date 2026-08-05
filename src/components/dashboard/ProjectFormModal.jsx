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
import { fileToDataUrl } from '../../utils/fileToDataUrl.js'

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
  const [form, setForm] = useState(emptyForm)
  const [stepRows, setStepRows] = useState([])
  const [outcomesText, setOutcomesText] = useState('')
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
        link: editingItem.link || '',
        linkEnabled: editingItem.linkEnabled ?? true,
      })
      setStepRows((editingItem.steps || []).map((s) => ({ ...s })))
      setOutcomesText((editingItem.outcomes || []).join('\n'))
      setImageList([...(editingItem.images || [])])
      setDownloadRows((editingItem.downloads || []).map((d) => ({ ...d })))
    } else {
      setForm(emptyForm)
      setStepRows([])
      setOutcomesText('')
      setImageList([])
      setDownloadRows([])
    }
    setImageUrlInput('')
    setLocalError(null)
  }, [open, editingItem])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

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
    const outcomes = outcomesText.split('\n').map((s) => s.trim()).filter(Boolean)
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
          {editingItem ? 'Edit Project' : 'New Project'}
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
          <TextField label="Subtitle" required fullWidth value={form.subtitle} onChange={set('subtitle')} sx={fieldSx} />

          <div style={{ display: 'flex', gap: '1rem' }}>
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
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Images {imageList.length === 0 && <span style={{ color: 'var(--accent-pink)' }}>*</span>}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
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
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 8,
                padding: '6px 12px',
                border: '1px dashed var(--border)',
                borderRadius: 8,
                color: 'var(--accent)',
                fontSize: 12.5,
                cursor: 'pointer',
              }}
            >
              📁 Upload image file(s)
              <input type="file" accept="image/*" multiple onChange={handleImageFiles} style={{ display: 'none' }} />
            </label>

            {imageList.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
                {imageList.map((src, i) => (
                  <div key={i} style={{ position: 'relative', width: 84, height: 84 }}>
                    <img
                      src={src}
                      alt={`Preview ${i + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      aria-label={`Remove image ${i + 1}`}
                      style={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        border: 'none',
                        background: 'var(--accent-pink)',
                        color: '#fff',
                        fontSize: 12,
                        lineHeight: '20px',
                        cursor: 'pointer',
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <TextField
            label="Objective"
            multiline
            minRows={2}
            fullWidth
            value={form.objective}
            onChange={set('objective')}
            sx={fieldSx}
          />

          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Architecture & Steps
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stepRows.map((row, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <TextField
                    label={`Step ${i + 1} title`}
                    value={row.title}
                    onChange={(e) => updateStepRow(i, { title: e.target.value })}
                    sx={{ ...fieldSx, flex: '1 1 35%' }}
                  />
                  <TextField
                    label="Text (may include <strong>…</strong>)"
                    multiline
                    value={row.text}
                    onChange={(e) => updateStepRow(i, { text: e.target.value })}
                    sx={{ ...fieldSx, flex: '1 1 55%' }}
                  />
                  <IconButton size="small" onClick={() => removeStepRow(i)} sx={{ color: 'var(--accent-pink)', marginTop: 1 }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addStepRow}
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
              + Add step
            </button>
          </div>

          <TextField
            label={form.group === 'frontend' ? 'Tech stack (comma separated)' : 'AWS services (comma separated)'}
            fullWidth
            value={form.techOrAws}
            onChange={set('techOrAws')}
            sx={fieldSx}
          />

          <TextField
            label="Outcomes (one per line)"
            required
            multiline
            minRows={3}
            fullWidth
            value={outcomesText}
            onChange={(e) => setOutcomesText(e.target.value)}
            sx={fieldSx}
          />

          <TextField
            label="Display order"
            type="number"
            fullWidth
            value={form.order}
            onChange={set('order')}
            sx={fieldSx}
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
                <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                  Link enabled — when off, this{' '}
                  <strong style={{ color: 'var(--accent-pink)' }}>entire project is hidden</strong> from the public site
                </span>
              }
            />
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Download Buttons (in addition to the auto-generated case study PDF)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {downloadRows.map((row, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
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
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '8px 10px',
                      marginTop: 4,
                      border: '1px dashed var(--border)',
                      borderRadius: 8,
                      color: 'var(--accent)',
                      fontSize: 12,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    📁 Upload
                    <input type="file" onChange={(e) => handleDownloadFileUpload(i, e)} style={{ display: 'none' }} />
                  </label>
                  <IconButton size="small" onClick={() => removeDownloadRow(i)} sx={{ color: 'var(--accent-pink)', marginTop: 1 }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addDownloadRow}
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
