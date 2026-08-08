import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Switch from '@mui/material/Switch'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import {
  fetchAllProjectCategories,
  updateProjectCategory,
  deleteProjectCategory,
} from '../../store/projectCategoriesSlice.js'
import { addToast } from '../../store/toastSlice.js'
import { resolveIcon } from '../../utils/iconRegistry.js'
import ProjectCategoryFormModal from './ProjectCategoryFormModal.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'

// Admin-manageable taxonomy: groups (Frontend/DevOps-style top-level tabs) each with
// their own sub-categories nested underneath. One flat fetch (fetchAllProjectCategories,
// enabled + disabled) split client-side by `parent` — same "load everything once,
// derive views locally" approach as ProjectsPanel.jsx.
export default function ProjectCategoriesPanel() {
  const dispatch = useDispatch()
  const { items, status } = useSelector((s) => s.projectCategories)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [lockedParent, setLockedParent] = useState(null)
  const [lockedParentLabel, setLockedParentLabel] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [blockedMessage, setBlockedMessage] = useState(null)

  useEffect(() => {
    dispatch(fetchAllProjectCategories())
  }, [dispatch])

  const refetch = () => dispatch(fetchAllProjectCategories())

  const groups = items.filter((c) => !c.parent).sort((a, b) => a.order - b.order)
  const childrenOf = (groupId) => items.filter((c) => c.parent === groupId).sort((a, b) => a.order - b.order)

  const openNewGroup = () => {
    setEditingItem(null)
    setLockedParent(null)
    setLockedParentLabel(null)
    setModalOpen(true)
  }
  const openNewSubcategory = (group) => {
    setEditingItem(null)
    setLockedParent(group._id)
    setLockedParentLabel(group.label)
    setModalOpen(true)
  }
  const openEdit = (item, parentLabel) => {
    setEditingItem({ ...item, parentLabel })
    setLockedParent(item.parent)
    setLockedParentLabel(parentLabel)
    setModalOpen(true)
  }

  const handleToggleEnabled = async (item) => {
    await dispatch(updateProjectCategory({ id: item._id, data: { enabled: !item.enabled } }))
    dispatch(addToast({ message: `"${item.label}" ${item.enabled ? 'disabled' : 'enabled'}`, severity: 'info' }))
    refetch()
  }

  const requestDelete = (item) => {
    if (!item.parent && childrenOf(item._id).length > 0) {
      setBlockedMessage(`Delete or reassign "${item.label}"'s sub-categories first.`)
      return
    }
    setDeleteTarget(item)
  }
  const confirmDelete = async () => {
    const item = deleteTarget
    setDeleteTarget(null)
    const result = await dispatch(deleteProjectCategory(item._id))
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(addToast({ message: `"${item.label}" deleted`, severity: 'info' }))
    } else {
      dispatch(addToast({ message: result.payload || `Could not delete "${item.label}"`, severity: 'error' }))
    }
    refetch()
  }

  const handleSaved = (wasEdit, label, isSubcategory) => {
    setModalOpen(false)
    dispatch(
      addToast({
        message: `${isSubcategory ? 'Sub-category' : 'Group'} "${label}" ${wasEdit ? 'updated' : 'added'}`,
        severity: 'success',
      })
    )
    refetch()
  }

  return (
    <div>
      <div className="dash-taxonomy-header">
        <h3 className="dash-taxonomy-title">Project Taxonomy</h3>
        <Button
          onClick={openNewGroup}
          startIcon={<AddIcon fontSize="small" />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 10,
            background: 'var(--gradient-1)',
            color: '#0a0a0f',
            padding: '6px 14px',
            fontSize: 12.5,
            '&:hover': { background: 'var(--gradient-1)', opacity: 0.9 },
          }}
        >
          New Group
        </Button>
      </div>

      {status === 'loading' && items.length === 0 ? (
        <p className="dash-muted-text">Loading…</p>
      ) : groups.length === 0 ? (
        <p className="dash-muted-text">No groups yet.</p>
      ) : (
        <div className="dash-group-list">
          {groups.map((group) => {
            const GroupIcon = resolveIcon(group.iconKey)
            const children = childrenOf(group._id)
            return (
              <div key={group._id} className="dash-group-card">
                <div className="dash-taxonomy-row">
                  <span className="dash-taxonomy-dot" style={{ '--dot-color': group.color }} />
                  <GroupIcon className="dash-taxonomy-icon" style={{ '--icon-color': group.color }} />
                  <span className="dash-taxonomy-label dash-taxonomy-label--group">{group.label}</span>
                  {!group.enabled && <span className="dash-disabled-tag">(disabled)</span>}
                  <Switch
                    checked={group.enabled}
                    onChange={() => handleToggleEnabled(group)}
                    size="small"
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' } }}
                  />
                  <IconButton size="small" onClick={() => openEdit(group, null)} sx={{ color: 'var(--text-secondary)' }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => requestDelete(group)} sx={{ color: 'var(--accent-pink)' }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>

                <div className="dash-group-card__children">
                  {children.map((cat) => {
                    const CatIcon = resolveIcon(cat.iconKey)
                    return (
                      <div key={cat._id} className="dash-taxonomy-row">
                        <span className="dash-taxonomy-dot dash-taxonomy-dot--sm" style={{ '--dot-color': cat.color }} />
                        <CatIcon className="dash-taxonomy-icon dash-taxonomy-icon--sm" style={{ '--icon-color': cat.color }} />
                        <span className="dash-taxonomy-label dash-taxonomy-label--sub">{cat.label}</span>
                        {!cat.enabled && <span className="dash-disabled-tag">(disabled)</span>}
                        <Switch
                          checked={cat.enabled}
                          onChange={() => handleToggleEnabled(cat)}
                          size="small"
                          sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' } }}
                        />
                        <IconButton size="small" onClick={() => openEdit(cat, group.label)} sx={{ color: 'var(--text-secondary)' }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => requestDelete(cat)} sx={{ color: 'var(--accent-pink)' }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </div>
                    )
                  })}
                  <button type="button" onClick={() => openNewSubcategory(group)} className="dash-add-subcategory-btn">
                    + Add sub-category
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ProjectCategoryFormModal
        open={modalOpen}
        editingItem={editingItem}
        lockedParent={lockedParent}
        lockedParentLabel={lockedParentLabel}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Delete "${deleteTarget?.label}"?`}
        message="Existing projects using it keep their stored label — this only removes it from the taxonomy going forward."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <ConfirmDialog
        open={Boolean(blockedMessage)}
        title="Can't delete yet"
        message={blockedMessage}
        confirmLabel="OK"
        hideCancel
        onConfirm={() => setBlockedMessage(null)}
        onCancel={() => setBlockedMessage(null)}
      />
    </div>
  )
}
