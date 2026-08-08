import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
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
import ContentPresetsPanel from './ContentPresetsPanel.jsx'

const VALID_VIEWS = ['projects', 'categories', 'presets']

export default function ProjectsPanel() {
  const dispatch = useDispatch()
  const { items, status } = useSelector((s) => s.projects)
  const { items: categoryItems } = useSelector((s) => s.projectCategories)
  // `view` and `filter` both live in the URL (?view=, ?pfilter=), not useState — same
  // reasoning as DashboardPage's own `?tab=`: a refresh reloads the page fresh, so
  // anything held only in useState silently resets to its default. Both params coexist
  // with DashboardPage's `?tab=projects` in the same query string; every update below
  // copies the CURRENT searchParams first so it never clobbers params this component
  // doesn't own. `pfilter` (not `filter`) to avoid ever colliding with a future
  // same-named param on a sibling panel.
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedView = searchParams.get('view')
  const view = VALID_VIEWS.includes(requestedView) ? requestedView : 'projects'
  // Client-side filter only — everything is already fetched in one shot. 'all' | a
  // group's slug | a sub-category's slug.
  const filter = searchParams.get('pfilter') || 'all'

  const setView = (nextView) => {
    const next = new URLSearchParams(searchParams)
    next.set('view', nextView)
    setSearchParams(next, { replace: true })
  }
  const setFilter = (nextFilter) => {
    const next = new URLSearchParams(searchParams)
    next.set('pfilter', nextFilter)
    setSearchParams(next, { replace: true })
  }

  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
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
  const handleToggleEnabled = async (project) => {
    await dispatch(updateProject({ id: project._id, data: { enabled: !project.enabled } }))
    dispatch(addToast({ message: `"${project.title}" ${project.enabled ? 'disabled' : 'enabled'}`, severity: 'info' }))
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
    <div className="dash-project-grid">
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
                onToggleEnabled={handleToggleEnabled}
              />
            )}
          </SortableItem>
        ) : (
          <ProjectCard
            key={project._id}
            project={project}
            index={index}
            onEdit={handleEdit}
            onDelete={setDeleteTarget}
            onToggleEnabled={handleToggleEnabled}
          />
        )
      )}
    </div>
  )

  return (
    <div className="dash-panel">
      <div className="dash-view-tabs">
        {[
          { id: 'projects', label: 'Projects' },
          { id: 'categories', label: 'Categories' },
          { id: 'presets', label: 'Presets' },
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

      {view === 'categories' ? (
        <ProjectCategoriesPanel />
      ) : view === 'presets' ? (
        <ContentPresetsPanel />
      ) : (
        <>
          <div className="dash-filter-header">
            {/* Group buttons on their own row, sub-category chips on a SEPARATE row
                below — was previously crammed into one flex row with a "|" separator,
                which read as "in front of" the group tabs instead of clearly nested
                under the active one. */}
            <div className="dash-filter-column">
              <div className="dash-filter-row">
                <button
                  onClick={() => setFilter('all')}
                  className={`dash-group-tab${filter === 'all' ? ' active' : ''}`}
                >
                  All Projects
                </button>
                {groups.map((g) => {
                  const isActive = activeGroupSlug === g.slug
                  return (
                    <button
                      key={g._id}
                      onClick={() => setFilter(g.slug)}
                      className={`dash-group-tab${isActive ? ' active' : ''}`}
                      style={{ '--tab-color': g.color }}
                    >
                      {g.label}
                      {!g.enabled && <span className="dash-group-tab__disabled-note"> (disabled)</span>}
                    </button>
                  )
                })}
              </div>

              {visibleCategories.length > 0 && (
                <div className="dash-filter-row">
                  {visibleCategories.map((c) => {
                    const isActive = filter === c.slug
                    return (
                      <button
                        key={c._id}
                        onClick={() => setFilter(c.slug)}
                        className={`dash-group-tab dash-group-tab--sm${isActive ? ' active' : ''}`}
                        style={{ '--tab-color': c.color }}
                      >
                        {c.label}
                        {!c.enabled && <span className="dash-group-tab__disabled-note"> (disabled)</span>}
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
            <p className="dash-hint-text">
              Switch to "All Projects" to drag-and-drop reorder.
            </p>
          )}

          {status === 'loading' && items.length === 0 ? (
            <p className="dash-muted-text">Loading…</p>
          ) : filteredProjects.length === 0 ? (
            <p className="dash-muted-text">No projects yet.</p>
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
