import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import { resolveIcon } from '../../utils/iconRegistry.js'

// `dragHandle` is an optional rendered element (a <DragHandle .../>) passed down by
// SkillsPanel — same render-prop split ProjectCard.jsx already uses, this component
// stays unaware of dnd-kit itself.
export default function SkillCategoryCard({ category, index, dragHandle, onEdit, onDelete, onToggleEnabled }) {
  const CategoryIcon = resolveIcon(category.iconKey)
  const enabledTagCount = (category.tags || []).filter((t) => t.enabled !== false).length

  return (
    <div className={`dash-skill-card${category.enabled === false ? ' disabled' : ''}`} style={{ '--card-color': category.color }}>
      <div className="dash-skill-card__header">
        <div className="dash-skill-card__header-left">
          {dragHandle}
          <span className="dash-skill-card__index">
            #{String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <div className="dash-skill-card__actions">
          <Switch
            checked={category.enabled !== false}
            onChange={() => onToggleEnabled(category)}
            size="small"
            sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' } }}
          />
          <IconButton size="small" onClick={() => onEdit(category)} sx={{ color: 'var(--text-secondary)' }}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(category._id)} sx={{ color: 'var(--accent-pink)' }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      </div>
      {category.enabled === false && (
        <span className="dash-skill-card__disabled-note">
          Disabled — hidden from the public site
        </span>
      )}

      <div className="dash-skill-card__title-row">
        <span className="dash-skill-card__icon-wrap">
          <CategoryIcon className="dash-skill-card__icon" />
        </span>
        <span className="dash-skill-card__title">{category.title}</span>
      </div>

      <div className="dash-skill-card__tags">
        {(category.tags || []).length === 0 ? (
          <span className="dash-skill-card__empty-note">No technologies yet</span>
        ) : (
          category.tags.map((tag, i) => {
            const TagIcon = resolveIcon(tag.iconKey)
            return (
              <span
                key={`${tag.name}-${i}`}
                className={`dash-tech-chip${tag.enabled === false ? ' dash-tech-chip--disabled' : ''}`}
              >
                <TagIcon className="dash-tech-chip__icon" style={{ '--chip-color': category.color }} />
                {tag.name}
              </span>
            )
          })
        )}
      </div>

      <div className="dash-skill-card__count">
        {enabledTagCount} of {(category.tags || []).length} technolog{(category.tags || []).length === 1 ? 'y' : 'ies'} enabled
      </div>
    </div>
  )
}
