import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { fetchWorkHistory, deleteWorkHistoryEntry, updateWorkHistoryEntry } from '../../store/experienceSectionSlice.js'
import { addToast } from '../../store/toastSlice.js'
import { resolveIcon } from '../../utils/iconRegistry.js'
import { reorderList } from '../../utils/reorder.js'
import WorkHistoryFormModal from './WorkHistoryFormModal.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import SortableItem from './SortableItem.jsx'
import DragHandle from './DragHandle.jsx'

export default function WorkHistorySection() {
  const dispatch = useDispatch()
  const { items, status } = useSelector((s) => s.experienceSection.workHistory)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const refetch = () => dispatch(fetchWorkHistory())

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
    await dispatch(deleteWorkHistoryEntry(id))
    dispatch(addToast({ message: `"${target?.title || 'Entry'}" deleted`, severity: 'info' }))
    refetch()
  }
  const handleSaved = (wasEdit, title) => {
    setModalOpen(false)
    dispatch(addToast({ message: `"${title}" ${wasEdit ? 'updated' : 'added'}`, severity: 'success' }))
    refetch()
  }

  // Renumbers the whole list by array position (see utils/reorder.js) and persists
  // only the entries whose order actually changed, then refetches so the display
  // reflects the server-confirmed state rather than trusting the optimistic reorder.
  const handleReorder = async (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= items.length) return
    const reordered = reorderList(items, fromIndex, toIndex)
    const updates = reordered.filter((item) => {
      const original = items.find((orig) => orig._id === item._id)
      return original && original.order !== item.order
    })
    if (updates.length === 0) return
    await Promise.all(
      updates.map((item) => dispatch(updateWorkHistoryEntry({ id: item._id, data: { order: item.order } })))
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
    <section style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>Work History</h3>
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
        <p style={{ color: 'var(--text-secondary)' }}>No work history entries yet.</p>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text)' }}>{entry.title}</span>
                          {entry.current && (
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: 6,
                                background: 'rgba(16,185,129,0.15)',
                                color: 'var(--accent-green)',
                              }}
                            >
                              CURRENT
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 6 }}>
                          {entry.company} · {entry.location} · {entry.period}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {(entry.tech || []).map((t, i) => {
                            const Icon = resolveIcon(t.iconKey)
                            return (
                              <span
                                key={i}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  fontSize: 11,
                                  padding: '3px 8px',
                                  borderRadius: 6,
                                  background: 'rgba(255,255,255,0.04)',
                                  border: '1px solid rgba(255,255,255,0.08)',
                                  color: 'var(--text-secondary)',
                                }}
                              >
                                <Icon style={{ fontSize: 11, color: t.color }} />
                                {t.name}
                              </span>
                            )
                          })}
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

      <WorkHistoryFormModal
        open={modalOpen}
        editingItem={editingItem}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this work history entry?"
        message="This cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  )
}
