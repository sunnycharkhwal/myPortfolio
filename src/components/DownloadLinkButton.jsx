// Renders one admin-defined `project.downloads[]` entry ({label, url}). `url` is either
// a real pasted URL or a base64 data-URI (an uploaded file) — a plain <a download> works
// identically for both, no special-casing needed. Same visual family as
// DownloadCaseStudyButton.jsx, just a plain anchor instead of a Blob-generating button.
export default function DownloadLinkButton({ label, url, compact = false }) {
  return (
    <a
      href={url}
      download={label}
      target={url?.startsWith('data:') ? undefined : '_blank'}
      rel="noopener noreferrer"
      title={label}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: compact ? 6 : 10,
        maxWidth: '100%',
        padding: compact ? '6px 12px' : '12px 20px',
        background: 'rgba(168, 85, 247, 0.08)',
        border: '1px solid rgba(168, 85, 247, 0.25)',
        borderRadius: compact ? 8 : 12,
        color: 'var(--accent-purple)',
        fontSize: compact ? '0.7rem' : '0.85rem',
        fontWeight: 600,
        fontFamily: 'var(--mono)',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'all 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(168, 85, 247, 0.15)'
        e.currentTarget.style.borderColor = 'var(--accent-purple)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(168, 85, 247, 0.08)'
        e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.25)'
      }}
    >
      <svg width={compact ? 12 : 16} height={compact ? 12 : 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ flexShrink: 0 }}>
        <path d="M12 3v12" />
        <path d="M7 10l5 5 5-5" />
        <path d="M4 19h16" />
      </svg>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
        {label}
      </span>
    </a>
  )
}
