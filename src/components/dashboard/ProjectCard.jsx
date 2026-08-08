import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LinkIcon from '@mui/icons-material/Link'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import { useSelector } from 'react-redux'
import DownloadLinkButton from '../DownloadLinkButton.jsx'

// `dragHandle` is an optional rendered element (a <DragHandle .../>) passed down by
// ProjectsPanel when drag-and-drop is active (unfiltered view only) — this component
// stays unaware of dnd-kit itself, just renders whatever slot it's given.
export default function ProjectCard({ project, index, dragHandle, onEdit, onDelete, onToggleEnabled }) {
  // Badge color is looked up from the admin-manageable taxonomy by slug instead of a
  // static CSS class map — falls back to a neutral style if the category was since
  // deleted (same fallback precedent as resolveIcon in iconRegistry.js).
  const { items: categoryItems } = useSelector((s) => s.projectCategories)
  const categoryDoc = categoryItems.find((c) => c.slug === project.category)
  const badgeColor = categoryDoc?.color || '#8a8a9a'

  return (
    <div className={`dash-project-card${project.enabled === false ? ' disabled' : ''}`}>
      <div className="dash-project-card__header">
        <div className="dash-project-card__header-left">
          {dragHandle}
          <span className="dash-project-card__index">
            #{String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <div className="dash-project-card__actions">
          <Switch
            checked={project.enabled !== false}
            onChange={() => onToggleEnabled(project)}
            size="small"
            sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' } }}
          />
          <IconButton size="small" onClick={() => onEdit(project)} sx={{ color: 'var(--text-secondary)' }}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(project._id)} sx={{ color: 'var(--accent-pink)' }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      </div>
      {project.enabled === false && (
        <span className="dash-project-card__disabled-note">
          Disabled — hidden from the public site
        </span>
      )}

      <div className="dash-project-card__title">{project.title}</div>
      <div className="dash-project-card__subtitle">{project.subtitle}</div>

      <div className="dash-project-card__meta">
        <span className="dash-project-card__badge" style={{ '--badge-color': badgeColor }}>
          {project.catLabel}
        </span>
        <span className="dash-project-card__image-count">
          {project.images?.length || 0} image{project.images?.length === 1 ? '' : 's'}
        </span>
        {project.link && (
          <span
            className={`dash-project-card__link-status${project.linkEnabled ? ' enabled' : ' disabled'}`}
            title={project.link}
          >
            <LinkIcon sx={{ fontSize: 13 }} />
            {project.linkEnabled ? 'Link enabled' : 'Link disabled — "Visit Project" button hidden'}
          </span>
        )}
      </div>

      {/* Only admin-added downloads render here now — the auto-generated case-study PDF
          button used to always render regardless of what was entered, which read as a
          button "appearing on its own" on projects with no downloads configured. Same
          fix already applied to the public site's project modal; DownloadCaseStudyButton
          itself is untouched and still used elsewhere. */}
      {project.downloads && project.downloads.length > 0 && (
        <div className="dash-project-card__downloads">
          {project.downloads.map((d, i) => (
            <DownloadLinkButton key={i} label={d.label} url={d.url} compact />
          ))}
        </div>
      )}
    </div>
  )
}
