import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LinkIcon from '@mui/icons-material/Link'
import IconButton from '@mui/material/IconButton'
import { useSelector } from 'react-redux'
import DownloadLinkButton from '../DownloadLinkButton.jsx'

// `dragHandle` is an optional rendered element (a <DragHandle .../>) passed down by
// ProjectsPanel when drag-and-drop is active (unfiltered view only) — this component
// stays unaware of dnd-kit itself, just renders whatever slot it's given.
export default function ProjectCard({ project, index, dragHandle, onEdit, onDelete }) {
  // Badge color is looked up from the admin-manageable taxonomy by slug instead of a
  // static CSS class map — falls back to a neutral style if the category was since
  // deleted (same fallback precedent as resolveIcon in iconRegistry.js).
  const { items: categoryItems } = useSelector((s) => s.projectCategories)
  const categoryDoc = categoryItems.find((c) => c.slug === project.category)
  const badgeColor = categoryDoc?.color || '#8a8a9a'

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '1.25rem 1.4rem',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          {dragHandle}
          <span
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 11,
              color: 'var(--muted)',
              flexShrink: 0,
            }}
          >
            #{String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
          <IconButton size="small" onClick={() => onEdit(project)} sx={{ color: 'var(--text-secondary)' }}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(project._id)} sx={{ color: 'var(--accent-pink)' }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      </div>

      <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--text)' }}>{project.title}</div>
      <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{project.subtitle}</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span
          style={{
            fontSize: 11,
            padding: '3px 9px',
            borderRadius: 6,
            fontWeight: 600,
            background: `${badgeColor}20`,
            border: `1px solid ${badgeColor}60`,
            color: badgeColor,
          }}
        >
          {project.catLabel}
        </span>
        <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
          {project.images?.length || 0} image{project.images?.length === 1 ? '' : 's'}
        </span>
        {project.link && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              fontSize: 11,
              color: project.linkEnabled ? 'var(--accent-green)' : 'var(--muted)',
              fontStyle: project.linkEnabled ? 'normal' : 'italic',
            }}
            title={project.link}
          >
            <LinkIcon sx={{ fontSize: 13 }} />
            {project.linkEnabled ? 'Link enabled' : 'Link disabled — hidden from public site'}
          </span>
        )}
      </div>

      {/* Only admin-added downloads render here now — the auto-generated case-study PDF
          button used to always render regardless of what was entered, which read as a
          button "appearing on its own" on projects with no downloads configured. Same
          fix already applied to the public site's project modal; DownloadCaseStudyButton
          itself is untouched and still used elsewhere. */}
      {project.downloads && project.downloads.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 2 }}>
          {project.downloads.map((d, i) => (
            <DownloadLinkButton key={i} label={d.label} url={d.url} compact />
          ))}
        </div>
      )}
    </div>
  )
}
