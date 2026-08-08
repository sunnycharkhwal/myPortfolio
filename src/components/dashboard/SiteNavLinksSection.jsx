import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { fetchSiteNavLinks, deleteSiteNavLink, updateSiteNavLink } from '../../store/siteNavLinksSlice.js'
import { addToast } from '../../store/toastSlice.js'
import { reorderList } from '../../utils/reorder.js'
import SiteNavLinkCard from './SiteNavLinkCard.jsx'
import SiteNavLinkFormModal from './SiteNavLinkFormModal.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import SortableItem from './SortableItem.jsx'
import DragHandle from './DragHandle.jsx'

// Self-contained CRUD section for the Nav bar's link list — full CRUD, enable/disable,
// delete-confirm, drag-reorder, same shape as FooterLinksSection.jsx.
export default function SiteNavLinksSection() {
  const dispatch = useDispatch()
  const { items, status } = useSelector((s) => s.siteNavLinks)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    dispatch(fetchSiteNavLinks())
  }, [dispatch])

  const refetch = () => dispatch(fetchSiteNavLinks())

  const handleNew = () => {
    setEditingItem(null)
    setModalOpen(true)
  }
  const handleEdit = (link) => {
    setEditingItem(link)
    setModalOpen(true)
  }
  const confirmDelete = async () => {
    const id = deleteTarget
    const target = items.find((l) => l._id === id)
    setDeleteTarget(null)
    await dispatch(deleteSiteNavLink(id))
    dispatch(addToast({ message: `"${target?.label || 'Link'}" deleted`, severity: 'info' }))
    refetch()
  }
  const handleSaved = (wasEdit, label) => {
    setModalOpen(false)
    dispatch(addToast({ message: `"${label}" ${wasEdit ? 'updated' : 'added'}`, severity: 'success' }))
    refetch()
  }
  const handleToggleEnabled = async (link) => {
    await dispatch(updateSiteNavLink({ id: link._id, data: { enabled: !link.enabled } }))
    dispatch(addToast({ message: `"${link.label}" ${link.enabled ? 'disabled' : 'enabled'}`, severity: 'info' }))
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
    await Promise.all(updates.map((item) => dispatch(updateSiteNavLink({ id: item._id, data: { order: item.order } }))))
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
        <h3 className="dash-section-title">Nav Bar Links</h3>
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
          + New Link
        </Button>
      </div>

      <p className="dash-hint-text">
        Drag a card's handle to reorder — the number badge follows. A link pointing at a
        disabled section (see the "General" tab) is automatically hidden even if it's
        enabled here.
      </p>

      {status === 'loading' && items.length === 0 ? (
        <p className="dash-muted-text">Loading…</p>
      ) : items.length === 0 ? (
        <p className="dash-muted-text">No links yet.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i._id)} strategy={rectSortingStrategy}>
            <div className="dash-skill-grid">
              {items.map((link, index) => (
                <SortableItem key={link._id} id={link._id}>
                  {(handle) => (
                    <SiteNavLinkCard
                      link={link}
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

      <SiteNavLinkFormModal
        open={modalOpen}
        editingItem={editingItem}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this nav link?"
        message="This removes it from the Nav bar. This cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}
