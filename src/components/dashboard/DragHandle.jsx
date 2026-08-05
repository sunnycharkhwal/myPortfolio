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
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        background: 'none',
        border: 'none',
        borderRadius: 6,
        color: 'var(--muted)',
        cursor: 'grab',
        flexShrink: 0,
        touchAction: 'none',
      }}
    >
      <DragIndicatorIcon fontSize="small" />
    </button>
  )
}
