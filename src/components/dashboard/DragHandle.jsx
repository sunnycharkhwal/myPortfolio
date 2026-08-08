import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

// The actual drag-activation target — spreads dnd-kit's listeners/attributes so only
// grabbing this icon starts a drag, never a click anywhere else in the row.
export default function DragHandle({ setActivatorNodeRef, attributes, listeners }) {
  return (
    <button
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
      aria-label="Drag to reorder"
      className="dash-drag-handle"
    >
      <DragIndicatorIcon fontSize="small" />
    </button>
  )
}
