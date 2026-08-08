import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import Button from '@mui/material/Button'
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { fetchContactServices, deleteContactService, updateContactService } from '../../store/contactServicesSlice.js'
import { addToast } from '../../store/toastSlice.js'
import { reorderList } from '../../utils/reorder.js'
import ContactServiceCard from './ContactServiceCard.jsx'
import ContactServiceFormModal from './ContactServiceFormModal.jsx'
import ContactSettingsForm from './ContactSettingsForm.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import SortableItem from './SortableItem.jsx'
import DragHandle from './DragHandle.jsx'

const VALID_VIEWS = ['services', 'settings']

// Top-level dashboard tab for the public Contact section — "Services" (the "How I Can
// Help You" cards: full CRUD, enable/disable, delete-confirm, drag-reorder, same shape
// as SkillsPanel.jsx's "Categories" view) plus "Settings" (the actual email/phone/
// LinkedIn/GitHub/location, managed by ContactSettingsForm) — same `?view=` URL-state
// split SkillsPanel.jsx uses between its "Categories" and "Section Content" views.
export default function ContactPanel() {
  const dispatch = useDispatch()
  const { items, status } = useSelector((s) => s.contactServices)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const [searchParams, setSearchParams] = useSearchParams()
  const requestedView = searchParams.get('view')
  const view = VALID_VIEWS.includes(requestedView) ? requestedView : 'services'
  const setView = (nextView) => {
    const next = new URLSearchParams(searchParams)
    next.set('view', nextView)
    setSearchParams(next, { replace: true })
  }

  useEffect(() => {
    dispatch(fetchContactServices())
  }, [dispatch])

  const refetch = () => dispatch(fetchContactServices())

  const handleNew = () => {
    setEditingItem(null)
    setModalOpen(true)
  }
  const handleEdit = (service) => {
    setEditingItem(service)
    setModalOpen(true)
  }
  const confirmDelete = async () => {
    const id = deleteTarget
    const target = items.find((s) => s._id === id)
    setDeleteTarget(null)
    await dispatch(deleteContactService(id))
    dispatch(addToast({ message: `"${target?.title || 'Service'}" deleted`, severity: 'info' }))
    refetch()
  }
  const handleSaved = (wasEdit, title) => {
    setModalOpen(false)
    dispatch(addToast({ message: `"${title}" ${wasEdit ? 'updated' : 'added'}`, severity: 'success' }))
    refetch()
  }
  const handleToggleEnabled = async (service) => {
    await dispatch(updateContactService({ id: service._id, data: { enabled: !service.enabled } }))
    dispatch(addToast({ message: `"${service.title}" ${service.enabled ? 'disabled' : 'enabled'}`, severity: 'info' }))
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
    await Promise.all(updates.map((item) => dispatch(updateContactService({ id: item._id, data: { order: item.order } }))))
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
    <div className="dash-panel">
      <div className="dash-view-tabs">
        {[
          { id: 'services', label: 'Services' },
          { id: 'settings', label: 'Settings' },
        ].map((t) => {
          const isActive = view === t.id
          return (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              className={`dash-view-tab${isActive ? ' active' : ''}`}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {view === 'settings' ? (
        <ContactSettingsForm />
      ) : (
        <>
          <div className="dash-filter-header">
            <h3 className="dash-section-title">"How I Can Help You" Services</h3>
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
              + New Service
            </Button>
          </div>

          <p className="dash-hint-text">
            Drag a card's handle to reorder — the number badge follows.
          </p>

          {status === 'loading' && items.length === 0 ? (
            <p className="dash-muted-text">Loading…</p>
          ) : items.length === 0 ? (
            <p className="dash-muted-text">No services yet.</p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={items.map((i) => i._id)} strategy={rectSortingStrategy}>
                <div className="dash-skill-grid">
                  {items.map((service, index) => (
                    <SortableItem key={service._id} id={service._id}>
                      {(handle) => (
                        <ContactServiceCard
                          service={service}
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

          <ContactServiceFormModal
            open={modalOpen}
            editingItem={editingItem}
            onClose={() => setModalOpen(false)}
            onSaved={handleSaved}
          />
          <ConfirmDialog
            open={Boolean(deleteTarget)}
            title="Delete this service?"
            message="This removes it from the public site. This cannot be undone."
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        </>
      )}
    </div>
  )
}
