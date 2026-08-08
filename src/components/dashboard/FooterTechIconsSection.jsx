import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { fetchFooterTechIcons, deleteFooterTechIcon, updateFooterTechIcon } from '../../store/footerTechIconsSlice.js'
import { addToast } from '../../store/toastSlice.js'
import { reorderList } from '../../utils/reorder.js'
import FooterTechIconCard from './FooterTechIconCard.jsx'
import FooterTechIconFormModal from './FooterTechIconFormModal.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import SortableItem from './SortableItem.jsx'
import DragHandle from './DragHandle.jsx'

// Self-contained CRUD section for the Footer's tech-icon divider strip — full CRUD,
// enable/disable, delete-confirm, drag-reorder, same shape as FooterLinksSection.jsx.
export default function FooterTechIconsSection() {
  const dispatch = useDispatch()
  const { items, status } = useSelector((s) => s.footerTechIcons)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    dispatch(fetchFooterTechIcons())
  }, [dispatch])

  const refetch = () => dispatch(fetchFooterTechIcons())

  const handleNew = () => {
    setEditingItem(null)
    setModalOpen(true)
  }
  const handleEdit = (techIcon) => {
    setEditingItem(techIcon)
    setModalOpen(true)
  }
  const confirmDelete = async () => {
    const id = deleteTarget
    const target = items.find((t) => t._id === id)
    setDeleteTarget(null)
    await dispatch(deleteFooterTechIcon(id))
    dispatch(addToast({ message: `"${target?.iconKey || 'Icon'}" deleted`, severity: 'info' }))
    refetch()
  }
  const handleSaved = (wasEdit, iconKey) => {
    setModalOpen(false)
    dispatch(addToast({ message: `"${iconKey}" ${wasEdit ? 'updated' : 'added'}`, severity: 'success' }))
    refetch()
  }
  const handleToggleEnabled = async (techIcon) => {
    await dispatch(updateFooterTechIcon({ id: techIcon._id, data: { enabled: !techIcon.enabled } }))
    dispatch(addToast({ message: `"${techIcon.iconKey}" ${techIcon.enabled ? 'disabled' : 'enabled'}`, severity: 'info' }))
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
    await Promise.all(updates.map((item) => dispatch(updateFooterTechIcon({ id: item._id, data: { order: item.order } }))))
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
    <>
      <div className="dash-filter-header">
        <h3 className="dash-section-title">Tech Icon Strip</h3>
        <Button
          onClick={handleNew}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 10,
            background: 'var(--gradient-1)',
            color: '#0a0a0f',
            padding: '8px 18px',
            whiteSpace: 'nowrap',
            '&:hover': { background: 'var(--gradient-1)', opacity: 0.9 },
          }}
        >
          + New Tech Icon
        </Button>
      </div>

      <p className="dash-hint-text">
        Drag a card's handle to reorder — the number badge follows.
      </p>

      {status === 'loading' && items.length === 0 ? (
        <p className="dash-muted-text">Loading…</p>
      ) : items.length === 0 ? (
        <p className="dash-muted-text">No tech icons yet.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i._id)} strategy={rectSortingStrategy}>
            <div className="dash-skill-grid">
              {items.map((techIcon, index) => (
                <SortableItem key={techIcon._id} id={techIcon._id}>
                  {(handle) => (
                    <FooterTechIconCard
                      techIcon={techIcon}
                      index={index}
                      dragHandle={<DragHandle {...handle} />}
                      onEdit={handleEdit}
                      onDelete={setDeleteTarget}
                      onToggleEnabled={handleToggleEnabled}
                    />
                  )}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <FooterTechIconFormModal
        open={modalOpen}
        editingItem={editingItem}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this tech icon?"
        message="This removes it from the Footer. This cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}
