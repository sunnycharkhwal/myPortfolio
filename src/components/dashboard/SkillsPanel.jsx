import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import Button from '@mui/material/Button'
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { fetchSkillCategories, deleteSkillCategory, updateSkillCategory } from '../../store/skillsSlice.js'
import { addToast } from '../../store/toastSlice.js'
import { reorderList } from '../../utils/reorder.js'
import SkillCategoryCard from './SkillCategoryCard.jsx'
import SkillCategoryFormModal from './SkillCategoryFormModal.jsx'
import SkillsSectionForm from './SkillsSectionForm.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import SortableItem from './SortableItem.jsx'
import DragHandle from './DragHandle.jsx'

const VALID_VIEWS = ['categories', 'content']

// Top-level dashboard tab for the public Tech Stack (Skills) section — same
// list/reorder/modal/confirm-delete shape as ProjectsPanel.jsx's "projects" view, plus
// a second "Section Content" view (the tagline/stats/footer copy around the grid,
// managed by SkillsSectionForm) — same `?view=` URL-state pattern ProjectsPanel.jsx
// uses to split "Projects" from "Categories"/"Presets".
export default function SkillsPanel() {
  const dispatch = useDispatch()
  const { items, status } = useSelector((s) => s.skills)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const [searchParams, setSearchParams] = useSearchParams()
  const requestedView = searchParams.get('view')
  const view = VALID_VIEWS.includes(requestedView) ? requestedView : 'categories'
  const setView = (nextView) => {
    const next = new URLSearchParams(searchParams)
    next.set('view', nextView)
    setSearchParams(next, { replace: true })
  }

  useEffect(() => {
    dispatch(fetchSkillCategories())
  }, [dispatch])

  const refetch = () => dispatch(fetchSkillCategories())

  const handleNew = () => {
    setEditingItem(null)
    setModalOpen(true)
  }
  const handleEdit = (category) => {
    setEditingItem(category)
    setModalOpen(true)
  }
  const confirmDelete = async () => {
    const id = deleteTarget
    const target = items.find((c) => c._id === id)
    setDeleteTarget(null)
    await dispatch(deleteSkillCategory(id))
    dispatch(addToast({ message: `"${target?.title || 'Category'}" deleted`, severity: 'info' }))
    refetch()
  }
  const handleSaved = (wasEdit, title) => {
    setModalOpen(false)
    dispatch(addToast({ message: `"${title}" ${wasEdit ? 'updated' : 'added'}`, severity: 'success' }))
    refetch()
  }
  const handleToggleEnabled = async (category) => {
    await dispatch(updateSkillCategory({ id: category._id, data: { enabled: !category.enabled } }))
    dispatch(addToast({ message: `"${category.title}" ${category.enabled ? 'disabled' : 'enabled'}`, severity: 'info' }))
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
    await Promise.all(updates.map((item) => dispatch(updateSkillCategory({ id: item._id, data: { order: item.order } }))))
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
          { id: 'categories', label: 'Categories' },
          { id: 'content', label: 'Section Content' },
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

      {view === 'content' ? (
        <SkillsSectionForm />
      ) : (
        <>
          <div className="dash-filter-header">
            <h3 className="dash-section-title">Tech Stack Categories</h3>
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
              + New Category
            </Button>
          </div>

          <p className="dash-hint-text">
            Drag a card's handle to reorder — the number badge follows.
          </p>

          {status === 'loading' && items.length === 0 ? (
            <p className="dash-muted-text">Loading…</p>
          ) : items.length === 0 ? (
            <p className="dash-muted-text">No skill categories yet.</p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={items.map((i) => i._id)} strategy={rectSortingStrategy}>
                <div className="dash-skill-grid">
                  {items.map((category, index) => (
                    <SortableItem key={category._id} id={category._id}>
                      {(handle) => (
                        <SkillCategoryCard
                          category={category}
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

          <SkillCategoryFormModal
            open={modalOpen}
            editingItem={editingItem}
            onClose={() => setModalOpen(false)}
            onSaved={handleSaved}
          />
          <ConfirmDialog
            open={Boolean(deleteTarget)}
            title="Delete this skill category?"
            message="This removes it and all of its technologies from the public site. This cannot be undone."
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        </>
      )}
    </div>
  )
}
