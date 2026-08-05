import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Shared by all three Experience sub-sections. Wraps one row/card with dnd-kit's
// sortable behavior — the whole item animates into place during a drag, but only the
// handle rendered via the render-prop below actually starts a drag, so clicking Edit/
// Delete elsewhere in the row is never mistaken for a drag gesture.
export default function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 1 : 'auto',
  }

  return (
    <div ref={setNodeRef} style={style}>
      {children({ attributes, listeners, setActivatorNodeRef })}
    </div>
  )
}
