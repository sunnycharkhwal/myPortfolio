import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { fetchEducation, deleteEducationEntry, updateEducationEntry } from '../../store/experienceSectionSlice.js'
import { addToast } from '../../store/toastSlice.js'
import { reorderList } from '../../utils/reorder.js'
import EducationFormModal from './EducationFormModal.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import SortableItem from './SortableItem.jsx'
import DragHandle from './DragHandle.jsx'

export default function EducationSection() {
  const dispatch = useDispatch()
  const { items, status } = useSelector((s) => s.experienceSection.education)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const refetch = () => dispatch(fetchEducation())

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
    await dispatch(deleteEducationEntry(id))
    dispatch(addToast({ message: `"${target?.degree || 'Entry'}" deleted`, severity: 'info' }))
    refetch()
  }
  const handleSaved = (wasEdit, degree) => {
    setModalOpen(false)
    dispatch(addToast({ message: `"${degree}" ${wasEdit ? 'updated' : 'added'}`, severity: 'success' }))
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
      updates.map((item) => dispatch(updateEducationEntry({ id: item._id, data: { order: item.order } })))
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
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>Education</h3>
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
          + New Entry
        </Button>
      </div>

      {status === 'loading' && items.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>
      ) : items.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>No education entries yet.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i._id)} strategy={verticalListSortingStrategy}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {items.map((entry) => (
                <SortableItem key={entry._id} id={entry._id}>
                  {(handle) => (
                    <div
                      style={{
                        background: 'linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%)',
                        border: '1px solid var(--border)',
                        borderRadius: 14,
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 12,
                      }}
                    >
                      <DragHandle {...handle} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
                          {entry.degree}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{entry.field}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                          {entry.institution} · {entry.location} · {entry.period}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                        <IconButton size="small" onClick={() => handleEdit(entry)} sx={{ color: 'var(--text-secondary)' }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => setDeleteTarget(entry._id)} sx={{ color: 'var(--accent-pink)' }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </div>
                  )}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <EducationFormModal
        open={modalOpen}
        editingItem={editingItem}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this education entry?"
        message="This cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  )
}
