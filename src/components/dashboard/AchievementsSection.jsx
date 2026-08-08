import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { fetchAchievements, deleteAchievementEntry, updateAchievementEntry } from '../../store/experienceSectionSlice.js'
import { addToast } from '../../store/toastSlice.js'
import { resolveIcon } from '../../utils/iconRegistry.js'
import { reorderList } from '../../utils/reorder.js'
import AchievementFormModal from './AchievementFormModal.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import SortableItem from './SortableItem.jsx'
import DragHandle from './DragHandle.jsx'

export default function AchievementsSection() {
  const dispatch = useDispatch()
  const { items, status } = useSelector((s) => s.experienceSection.achievements)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const refetch = () => dispatch(fetchAchievements())

  const handleNew = () => {
    setEditingItem(null)
    setModalOpen(true)
  }
  const handleEdit = (item) => {
    setEditingItem(item)
    setModalOpen(true)
  }
  const confirmDelete = async () => {
    const id = deleteTarget
    const target = items.find((i) => i._id === id)
    setDeleteTarget(null)
    await dispatch(deleteAchievementEntry(id))
    dispatch(addToast({ message: `"${target?.label || 'Achievement'}" deleted`, severity: 'info' }))
    refetch()
  }
  const handleToggleEnabled = async (item) => {
    await dispatch(updateAchievementEntry({ id: item._id, data: { enabled: !item.enabled } }))
    dispatch(addToast({ message: `"${item.label}" ${item.enabled ? 'disabled' : 'enabled'}`, severity: 'info' }))
    refetch()
  }
  const handleSaved = (wasEdit, label) => {
    setModalOpen(false)
    dispatch(addToast({ message: `"${label}" ${wasEdit ? 'updated' : 'added'}`, severity: 'success' }))
    refetch()
  }

  const handleReorder = async (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= items.length) return
    const reordered = reorderList(items, fromIndex, toIndex)
    const updates = reordered.filter((item) => {
      const original = items.find((orig) => orig._id === item._id)
      return original && original.order !== item.order
    })
    if (updates.length === 0) return
    await Promise.all(
      updates.map((item) => dispatch(updateAchievementEntry({ id: item._id, data: { order: item.order } })))
    )
    refetch()
  }

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return
    const fromIndex = items.findIndex((i) => i._id === active.id)
    const toIndex = items.findIndex((i) => i._id === over.id)
    if (fromIndex === -1 || toIndex === -1) return
    handleReorder(fromIndex, toIndex)
  }

  return (
    <section className="dash-section">
      <div className="dash-section-header">
        <h3 className="dash-section-title">Achievements</h3>
        <Button
          onClick={handleNew}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 10,
            background: 'var(--gradient-1)',
            color: '#0a0a0f',
            padding: '8px 18px',
            '&:hover': { background: 'var(--gradient-1)', opacity: 0.9 },
          }}
        >
          + New Achievement
        </Button>
      </div>

      {status === 'loading' && items.length === 0 ? (
        <p className="dash-muted-text">Loading…</p>
      ) : items.length === 0 ? (
        <p className="dash-muted-text">No achievements yet.</p>
      ) : (
        // rectSortingStrategy (not vertical-list) — this is a CSS grid, not a column.
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i._id)} strategy={rectSortingStrategy}>
            <div className="dash-achievement-grid">
              {items.map((item) => {
                const Icon = resolveIcon(item.iconKey)
                return (
                  <SortableItem key={item._id} id={item._id}>
                    {(handle) => (
                      <div className={`dash-achievement-tile${item.enabled === false ? ' disabled' : ''}`}>
                        <div className="dash-achievement-tile__drag">
                          <DragHandle {...handle} />
                        </div>
                        <div className="dash-achievement-tile__actions">
                          <Switch
                            checked={item.enabled !== false}
                            onChange={() => handleToggleEnabled(item)}
                            size="small"
                            sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' }, transform: 'scale(0.8)' }}
                          />
                          <IconButton size="small" onClick={() => handleEdit(item)} sx={{ color: 'var(--text-secondary)' }}>
                            <EditIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                          <IconButton size="small" onClick={() => setDeleteTarget(item._id)} sx={{ color: 'var(--accent-pink)' }}>
                            <DeleteIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </div>
                        <Icon className="dash-achievement-tile__icon" style={{ '--tile-color': item.color }} />
                        <div className="dash-achievement-tile__value" style={{ '--tile-color': item.color }}>{item.value}</div>
                        <div className="dash-achievement-tile__label">{item.label}</div>
                      </div>
                    )}
                  </SortableItem>
                )
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <AchievementFormModal
        open={modalOpen}
        editingItem={editingItem}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this achievement?"
        message="This cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  )
}
