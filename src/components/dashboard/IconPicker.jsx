import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import { ICON_KEYS, resolveIcon } from '../../utils/iconRegistry.js'

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    color: 'var(--text)',
    '& fieldset': { borderColor: 'var(--border)' },
    '&:hover fieldset': { borderColor: 'rgba(0, 212, 255, 0.4)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--accent)' },
  },
  '& .MuiInputLabel-root': { color: 'var(--text-secondary)' },
  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--accent)' },
}

// Shared by WorkHistoryFormModal (per tech row) and AchievementFormModal (single
// field) — renders the actual resolved icon next to its key in each option, so the
// admin recognizes it visually instead of picking a bare string off a list.
export default function IconPicker({ value, onChange, label = 'Icon' }) {
  return (
    <TextField select label={label} fullWidth value={value} onChange={onChange} sx={fieldSx}>
      {ICON_KEYS.map((key) => {
        const Icon = resolveIcon(key)
        return (
          <MenuItem key={key} value={key}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Icon style={{ fontSize: 14 }} />
              {key}
            </span>
          </MenuItem>
        )
      })}
    </TextField>
  )
}
