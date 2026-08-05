import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { fetchProjects, deleteProject, updateProject } from '../../store/projectsSlice.js'
import { fetchAllProjectCategories } from '../../store/projectCategoriesSlice.js'
import { addToast } from '../../store/toastSlice.js'
import { reorderList } from '../../utils/reorder.js'
import ProjectCard from './ProjectCard.jsx'
import ProjectFormModal from './ProjectFormModal.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import SortableItem from './SortableItem.jsx'
import DragHandle from './DragHandle.jsx'
import ProjectCategoriesPanel from './ProjectCategoriesPanel.jsx'

export default function ProjectsPanel() {
  const dispatch = useDispatch()
  const { items, status } = useSelector((s) => s.projects)
  const { items: categoryItems } = useSelector((s) => s.projectCategories)
  const [view, setView] = useState('projects') // 'projects' | 'categories'
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  // Client-side filter only — everything is already fetched in one shot. 'all' | a
  // group's slug | a sub-category's slug.
  const [filter, setFilter] = useState('all')
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    dispatch(fetchProjects())
    // Manage list (enabled + disabled) — the admin can still filter by / find projects
    // in a disabled group/category here, unlike the public site.
    dispatch(fetchAllProjectCategories())
  }, [dispatch])

  const refetch = () => dispatch(fetchProjects())

  const handleNew = () => {
    setEditingItem(null)
    setModalOpen(true)
  }
  const handleEdit = (project) => {
    setEditingItem(project)
    setModalOpen(true)
  }
  const confirmDelete = async () => {
    const id = deleteTarget
    const target = items.find((p) => p._id === id)
    setDeleteTarget(null)
    await dispatch(deleteProject(id))
    dispatch(addToast({ message: `"${target?.title || 'Project'}" deleted`, severity: 'info' }))
    refetch()
  }
  const handleSaved = (wasEdit, title) => {
    setModalOpen(false)
    dispatch(addToast({ message: `"${title}" ${wasEdit ? 'updated' : 'added'}`, severity: 'success' }))
    refetch()
  }

  const groups = categoryItems.filter((c) => !c.parent).sort((a, b) => a.order - b.order)
  const categories = categoryItems.filter((c) => c.parent)

  const isGroupFilter = groups.some((g) => g.slug === filter)
  const activeGroupSlug = filter === 'all' ? 'all' : isGroupFilter ? filter : (() => {
    const cat = categories.find((c) => c.slug === filter)
    const parentGroup = cat ? groups.find((g) => g._id === cat.parent) : null
    return parentGroup ? parentGroup.slug : 'all'
  })()
  const visibleCategories = activeGroupSlug === 'all'
    ? []
    : categories.filter((c) => {
        const parentGroup = groups.find((g) => g._id === c.parent)
        return parentGroup && parentGroup.slug === activeGroupSlug
      })
  const filteredProjects =
    filter === 'all' ? items : isGroupFilter ? items.filter((p) => p.group === filter) : items.filter((p) => p.category === filter)

  // Reordering only makes sense against the FULL list — dragging within a filtered
  // subset would be ambiguous (what does "past a hidden item" even mean?), so
  // drag-and-drop is only enabled when no filter is applied.
  const reorderEnabled = filter === 'all'

  const handleReorder = async (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= items.length) return
    const reordered = reorderList(items, fromIndex, toIndex)
    const updates = reordered.filter((item) => {
      const original = items.find((orig) => orig._id === item._id)
      return original && original.order !== item.order
    })
    if (updates.length === 0) return
    await Promise.all(updates.map((item) => dispatch(updateProject({ id: item._id, data: { order: item.order } }))))
    refetch()
  }

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return
    const fromIndex = items.findIndex((i) => i._id === active.id)
    const toIndex = items.findIndex((i) => i._id === over.id)
    if (fromIndex === -1 || toIndex === -1) return
    handleReorder(fromIndex, toIndex)
  }

  const grid = (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
      {filteredProjects.map((project, index) =>
        reorderEnabled ? (
          <SortableItem key={project._id} id={project._id}>
            {(handle) => (
              <ProjectCard
                project={project}
                index={index}
                dragHandle={<DragHandle {...handle} />}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
              />
            )}
          </SortableItem>
        ) : (
          <ProjectCard key={project._id} project={project} index={index} onEdit={handleEdit} onDelete={setDeleteTarget} />
        )
      )}
    </div>
  )

  return (
    <div style={{ padding: 'clamp(1.25rem, 4vw, 2rem)' }}>
      <div
        style={{
          display: 'inline-flex',
          gap: 4,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 50,
          padding: 4,
          marginBottom: '1.25rem',
        }}
      >
        {[
          { id: 'projects', label: 'Projects' },
          { id: 'categories', label: 'Categories' },
        ].map((t) => {
          const isActive = view === t.id
          return (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              style={{
                padding: '7px 16px',
                borderRadius: 30,
                border: 'none',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)'
                  : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {view === 'categories' ? (
        <ProjectCategoriesPanel />
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: 10 }}>
            {/* Group buttons on their own row, sub-category chips on a SEPARATE row
                below — was previously crammed into one flex row with a "|" separator,
                which read as "in front of" the group tabs instead of clearly nested
                under the active one. */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <button
                  onClick={() => setFilter('all')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    border: `1px solid ${filter === 'all' ? 'var(--accent)' : 'rgba(255,255,255,0.08)'}`,
                    background: filter === 'all' ? 'rgba(0, 212, 255, 0.12)' : 'rgba(255,255,255,0.02)',
                    color: filter === 'all' ? 'var(--accent)' : 'var(--text-secondary)',
                    fontSize: 12.5,
                    fontWeight: filter === 'all' ? 600 : 500,
                    cursor: 'pointer',
                  }}
                >
                  All Projects
                </button>
                {groups.map((g) => {
                  const isActive = activeGroupSlug === g.slug
                  return (
                    <button
                      key={g._id}
                      onClick={() => setFilter(g.slug)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 8,
                        border: `1px solid ${isActive ? g.color : 'rgba(255,255,255,0.08)'}`,
                        background: isActive ? `${g.color}20` : 'rgba(255,255,255,0.02)',
                        color: isActive ? g.color : 'var(--text-secondary)',
                        fontSize: 12.5,
                        fontWeight: isActive ? 600 : 500,
                        cursor: 'pointer',
                      }}
                    >
                      {g.label}
                      {!g.enabled && <span style={{ opacity: 0.6, fontStyle: 'italic' }}> (disabled)</span>}
                    </button>
                  )
                })}
              </div>

              {visibleCategories.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {visibleCategories.map((c) => {
                    const isActive = filter === c.slug
                    return (
                      <button
                        key={c._id}
                        onClick={() => setFilter(c.slug)}
                        style={{
                          padding: '5px 12px',
                          borderRadius: 8,
                          border: `1px solid ${isActive ? c.color : 'rgba(255,255,255,0.08)'}`,
                          background: isActive ? `${c.color}20` : 'rgba(255,255,255,0.02)',
                          color: isActive ? c.color : 'var(--text-secondary)',
                          fontSize: 12,
                          fontWeight: isActive ? 600 : 500,
                          cursor: 'pointer',
                        }}
                      >
                        {c.label}
                        {!c.enabled && <span style={{ opacity: 0.6, fontStyle: 'italic' }}> (disabled)</span>}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

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
              + New Project
            </Button>
          </div>

          {!reorderEnabled && (
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: '1rem' }}>
              Switch to "All Projects" to drag-and-drop reorder.
            </p>
          )}

          {status === 'loading' && items.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>
          ) : filteredProjects.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No projects yet.</p>
          ) : reorderEnabled ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={filteredProjects.map((p) => p._id)} strategy={rectSortingStrategy}>
                {grid}
              </SortableContext>
            </DndContext>
          ) : (
            grid
          )}

          <ProjectFormModal
            open={modalOpen}
            editingItem={editingItem}
            onClose={() => setModalOpen(false)}
            onSaved={handleSaved}
          />
          <ConfirmDialog
            open={Boolean(deleteTarget)}
            title="Delete this project?"
            message="This cannot be undone."
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        </>
      )}
    </div>
  )
}
