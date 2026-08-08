import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'

// `dragHandle` is an optional rendered element (a <DragHandle .../>) passed down by
// ContactPanel — same render-prop split ProjectCard.jsx/SkillCategoryCard.jsx already use.
export default function ContactServiceCard({ service, index, dragHandle, onEdit, onDelete, onToggleEnabled }) {
  return (
    <div className={`dash-skill-card${service.enabled === false ? ' disabled' : ''}`} style={{ '--card-color': service.color }}>
      <div className="dash-skill-card__header">
        <div className="dash-skill-card__header-left">
          {dragHandle}
          <span className="dash-skill-card__index">
            #{String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <div className="dash-skill-card__actions">
          <Switch
            checked={service.enabled !== false}
            onChange={() => onToggleEnabled(service)}
            size="small"
            sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' } }}
          />
          <IconButton size="small" onClick={() => onEdit(service)} sx={{ color: 'var(--text-secondary)' }}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(service._id)} sx={{ color: 'var(--accent-pink)' }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      </div>
      {service.enabled === false && (
        <span className="dash-skill-card__disabled-note">
          Disabled — hidden from the public site
        </span>
      )}

      <div className="dash-skill-card__title-row">
        <span className="dash-skill-card__icon-wrap dash-skill-card__icon-wrap--emoji">
          {service.icon}
        </span>
        <span className="dash-skill-card__title">{service.title}</span>
      </div>

      <p className="dash-contact-service-card__desc">{service.desc}</p>
    </div>
  )
}
