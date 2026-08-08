import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import Switch from '@mui/material/Switch'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { fetchContentPresets, updateContentPreset, deleteContentPreset } from '../../store/contentPresetsSlice.js'
import { addToast } from '../../store/toastSlice.js'
import { htmlToPlainText } from '../../utils/htmlToPlainText.js'
import ContentPresetFormModal from './ContentPresetFormModal.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'

// Four sections, one per ContentPreset `kind` — the library ProjectFormModal's
// per-field "attach a pre-defined item" pickers read from. Same "load everything once,
// split client-side" approach as ProjectCategoriesPanel.jsx.
const SECTIONS = [
  { kind: 'objective', label: 'Objectives' },
  { kind: 'step', label: 'Architecture & Steps' },
  { kind: 'tech', label: 'Tech Stack / AWS Services' },
  { kind: 'outcome', label: 'Key Outcomes' },
]

// `text`/`stepText` are HTML for every kind except 'tech' (a short plain name) — this
// row is a plain-text preview only, never rendered as HTML, so stripping tags here is
// correct for every kind. htmlToPlainText is also a safe no-op on a plain string (no
// tags to strip), so it's fine to always apply it rather than branching on kind.
function presetSummary(item) {
  return item.kind === 'step' ? item.stepTitle : htmlToPlainText(item.text)
}

export default function ContentPresetsPanel() {
  const dispatch = useDispatch()
  const { items, status } = useSelector((s) => s.contentPresets)
  // Groups come from the same admin-manageable taxonomy as everything else (Project,
  // ProjectCategory) — already fetched by ProjectsPanel's own mount effect (it dispatches
  // fetchAllProjectCategories() regardless of which tab is active), so no extra fetch here.
  const { items: categoryItems } = useSelector((s) => s.projectCategories)
  const groups = categoryItems.filter((c) => !c.parent).sort((a, b) => a.order - b.order)

  // Group tab bar — "These are all <Group> presets" — mirrors the public Projects
  // section's own group-filter tabs. 'all' shows everything across every group at once;
  // any real group tab scopes both the heading and every section below it to just that
  // group's presets, which is the whole point: a Frontend project's picker only ever
  // offers Frontend-tagged presets, so this view lets you see/manage exactly that slice.
  // Lives in the URL (?presetGroup=), not useState, so a refresh doesn't silently bounce
  // back to "All" — same reasoning/pattern as ProjectsPanel's own ?view=/?pfilter=.
  const [searchParams, setSearchParams] = useSearchParams()
  const activeGroup = searchParams.get('presetGroup') || 'all'
  const setActiveGroup = (nextGroup) => {
    const next = new URLSearchParams(searchParams)
    next.set('presetGroup', nextGroup)
    setSearchParams(next, { replace: true })
  }
  const [modalOpen, setModalOpen] = useState(false)
  const [modalKind, setModalKind] = useState('objective')
  const [editingItem, setEditingItem] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    dispatch(fetchContentPresets())
  }, [dispatch])

  const refetch = () => dispatch(fetchContentPresets())

  const openNew = (kind) => {
    setModalKind(kind)
    setEditingItem(null)
    setModalOpen(true)
  }
  const openEdit = (item) => {
    setModalKind(item.kind)
    setEditingItem(item)
    setModalOpen(true)
  }
  const handleToggleEnabled = async (item) => {
    await dispatch(updateContentPreset({ id: item._id, data: { enabled: !item.enabled } }))
    dispatch(addToast({ message: `"${presetSummary(item)}" ${item.enabled ? 'disabled' : 'enabled'}`, severity: 'info' }))
    refetch()
  }
  const confirmDelete = async () => {
    const item = deleteTarget
    setDeleteTarget(null)
    await dispatch(deleteContentPreset(item._id))
    dispatch(addToast({ message: `"${presetSummary(item)}" deleted`, severity: 'info' }))
    refetch()
  }
  const handleSaved = (wasEdit) => {
    setModalOpen(false)
    dispatch(addToast({ message: `Preset ${wasEdit ? 'updated' : 'added'}`, severity: 'success' }))
    refetch()
  }

  const activeGroupDoc = groups.find((g) => g.slug === activeGroup)
  const groupFilteredItems = activeGroup === 'all' ? items : items.filter((i) => i.group === activeGroup)
  // New presets default into whichever group tab is active — 'all' has no single group
  // to default to, so falls back to the first real group instead (the form's Group
  // select is still fully editable either way, this is just a starting value).
  const defaultGroupForNew = activeGroup !== 'all' ? activeGroup : groups[0]?.slug || ''

  return (
    <div>
      <p className="dash-intro-text">
        These are the "attach a pre-defined item" choices offered when adding or editing a project —
        pick one there and it's copied in as fully editable text, never a locked reference. Every preset
        belongs to one group, so a Frontend project's pickers only ever offer Frontend presets, never
        DevOps ones. Disabling an item hides it from the picker without deleting it.
      </p>

      <div className="dash-group-tabs">
        <button
          onClick={() => setActiveGroup('all')}
          className={`dash-group-tab${activeGroup === 'all' ? ' active' : ''}`}
        >
          All
        </button>
        {groups.map((g) => {
          const isActive = activeGroup === g.slug
          return (
            <button
              key={g._id}
              onClick={() => setActiveGroup(g.slug)}
              className={`dash-group-tab${isActive ? ' active' : ''}`}
              style={{ '--tab-color': g.color }}
            >
              {g.label}
              {!g.enabled && <span className="dash-group-tab__disabled-note"> (disabled)</span>}
            </button>
          )
        })}
      </div>

      <p className="dash-group-heading">
        {activeGroup === 'all'
          ? 'Showing presets from every group.'
          : `These are all ${activeGroupDoc?.label || activeGroup} presets.`}
      </p>

      {status === 'loading' && items.length === 0 ? (
        <p className="dash-muted-text">Loading…</p>
      ) : (
        <div className="dash-kind-sections">
          {SECTIONS.map((section) => {
            const sectionItems = groupFilteredItems.filter((i) => i.kind === section.kind)
            return (
              <div key={section.kind} className="dash-kind-section">
                <div className="dash-kind-section__header">
                  <span className="dash-kind-section__title">{section.label}</span>
                  <Button
                    onClick={() => openNew(section.kind)}
                    startIcon={<AddIcon fontSize="small" />}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: 10,
                      background: 'var(--gradient-1)',
                      color: '#0a0a0f',
                      padding: '5px 12px',
                      fontSize: 12,
                      '&:hover': { background: 'var(--gradient-1)', opacity: 0.9 },
                    }}
                  >
                    Add
                  </Button>
                </div>

                {sectionItems.length === 0 ? (
                  <p className="dash-kind-section__empty">None yet.</p>
                ) : (
                  <div className="dash-row-group">
                    {sectionItems.map((item) => {
                      const groupDoc = groups.find((g) => g.slug === item.group)
                      return (
                        <div key={item._id} className="dash-taxonomy-row">
                          {activeGroup === 'all' && (
                            <span
                              className="dash-taxonomy-dot dash-taxonomy-dot--sm"
                              style={{ '--dot-color': groupDoc?.color || '#8a8a9a' }}
                              title={groupDoc?.label || item.group}
                            />
                          )}
                          <div className="dash-preset-row__body">
                            <div className={`dash-preset-row__summary${item.kind === 'step' ? ' step' : ''}`}>
                              {presetSummary(item)}
                            </div>
                            {item.kind === 'step' && (
                              <div className="dash-preset-row__subtext">
                                {htmlToPlainText(item.stepText)}
                              </div>
                            )}
                          </div>
                          {!item.enabled && <span className="dash-disabled-tag">(disabled)</span>}
                          <Switch
                            checked={item.enabled}
                            onChange={() => handleToggleEnabled(item)}
                            size="small"
                            sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' } }}
                          />
                          <IconButton size="small" onClick={() => openEdit(item)} sx={{ color: 'var(--text-secondary)' }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => setDeleteTarget(item)} sx={{ color: 'var(--accent-pink)' }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <ContentPresetFormModal
        open={modalOpen}
        kind={modalKind}
        defaultGroup={defaultGroupForNew}
        editingItem={editingItem}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this preset?"
        message="Projects that already used it keep their copied-in text — this only removes it from the picker going forward."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
