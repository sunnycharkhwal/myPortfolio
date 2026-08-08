import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'

// `dragHandle` is an optional rendered element (a <DragHandle .../>) passed down by
// FooterPanel — same render-prop split ProjectCard.jsx/SkillCategoryCard.jsx already use.
export default function FooterLinkCard({ link, index, dragHandle, onEdit, onDelete, onToggleEnabled }) {
  return (
    <div className={`dash-skill-card${link.enabled === false ? ' disabled' : ''}`}>
      <div className="dash-skill-card__header">
        <div className="dash-skill-card__header-left">
          {dragHandle}
          <span className="dash-skill-card__index">
            #{String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <div className="dash-skill-card__actions">
          <Switch
            checked={link.enabled !== false}
            onChange={() => onToggleEnabled(link)}
            size="small"
            sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' } }}
          />
          <IconButton size="small" onClick={() => onEdit(link)} sx={{ color: 'var(--text-secondary)' }}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(link._id)} sx={{ color: 'var(--accent-pink)' }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      </div>
      {link.enabled === false && (
        <span className="dash-skill-card__disabled-note">
          Disabled — hidden from the Footer
        </span>
      )}

      <span className="dash-skill-card__title">{link.label}</span>
      <p className="dash-contact-service-card__desc">{link.href}</p>
    </div>
  )
}
