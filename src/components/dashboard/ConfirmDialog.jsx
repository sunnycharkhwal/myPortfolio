import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'

// Shared by every delete action in the dashboard — replaces window.confirm() with a
// dialog that actually matches the app's visual language instead of an unstyleable
// native browser box.
export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  hideCancel = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            background: 'linear-gradient(180deg, rgba(25, 25, 35, 0.98) 0%, rgba(15, 15, 22, 0.99) 100%)',
            backgroundImage: 'none',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
          },
        },
        backdrop: {
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px) saturate(180%)' },
        },
      }}
    >
      <div style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.6rem' }}>
          {title}
        </h3>
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          {message || 'This action cannot be undone.'}
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          {!hideCancel && (
            <Button
              onClick={onCancel}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 10,
                color: 'var(--text-secondary)',
                padding: '8px 18px',
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={onConfirm}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 10,
              background: 'rgba(255, 107, 107, 0.15)',
              border: '1px solid rgba(255, 107, 107, 0.4)',
              color: 'var(--accent-pink)',
              padding: '8px 18px',
              '&:hover': { background: 'rgba(255, 107, 107, 0.25)' },
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
