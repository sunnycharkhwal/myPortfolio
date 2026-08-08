import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import { resolveIcon } from '../../utils/iconRegistry.js'

// `dragHandle` is an optional rendered element (a <DragHandle .../>) passed down by
// FooterPanel — same render-prop split ProjectCard.jsx/SkillCategoryCard.jsx already use.
export default function FooterTechIconCard({ techIcon, index, dragHandle, onEdit, onDelete, onToggleEnabled }) {
  const Icon = resolveIcon(techIcon.iconKey)

  return (
    <div className={`dash-skill-card${techIcon.enabled === false ? ' disabled' : ''}`} style={{ '--card-color': techIcon.color }}>
      <div className="dash-skill-card__header">
        <div className="dash-skill-card__header-left">
          {dragHandle}
          <span className="dash-skill-card__index">
            #{String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <div className="dash-skill-card__actions">
          <Switch
            checked={techIcon.enabled !== false}
            onChange={() => onToggleEnabled(techIcon)}
            size="small"
            sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' } }}
          />
          <IconButton size="small" onClick={() => onEdit(techIcon)} sx={{ color: 'var(--text-secondary)' }}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(techIcon._id)} sx={{ color: 'var(--accent-pink)' }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      </div>
      {techIcon.enabled === false && (
        <span className="dash-skill-card__disabled-note">
          Disabled — hidden from the Footer
        </span>
      )}

      <div className="dash-skill-card__title-row">
        <span className="dash-skill-card__icon-wrap">
          <Icon className="dash-skill-card__icon" />
        </span>
        <span className="dash-skill-card__title">{techIcon.iconKey}</span>
      </div>
    </div>
  )
}
