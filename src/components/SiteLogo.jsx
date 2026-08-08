import scrollTo from '../utils/scrollTo.js'

// Renders the site-wide logo from SiteSettings — either the uploaded image or the
// styled text, whichever `logoType` says. Shared by every place the logo appears (only
// Nav.jsx today; the dashboard's own "SC://dashboard" chrome is separate admin-only
// branding, deliberately left untouched).
//
// Anti-distortion contract: the image always renders inside a FIXED-size box
// (`--logo-box`, in px) with `object-fit: contain` — the image scales down/up to fit
// within that box while preserving its own aspect ratio, so it can never be stretched
// or squashed regardless of what shape was uploaded. Pixelation is a resolution
// problem, not a CSS one: keeping the display box small (36-40px tall, matching the
// Nav's actual rendered logo size) means even a modest upload still looks crisp — the
// dashboard's upload field also says as much.
export default function SiteLogo({ settings, size = 36, className = '' }) {
  const logoLink = settings?.logoLink || '#hero'

  const content =
    settings?.logoType === 'image' && settings.logoImageUrl ? (
      <img
        src={settings.logoImageUrl}
        alt="Logo"
        draggable={false}
        className="site-logo__img"
        style={{ '--logo-box': `${size}px` }}
      />
    ) : (
      <span className="site-logo__text" style={{ fontSize: size }}>
        {settings?.logoText || 'SC://dev'}
      </span>
    )

  // In-page anchor ("#hero") scrolls smoothly via the same utility every nav link
  // uses; anything else (a real URL) is a plain link — same duality FooterLink/
  // ContactSettings hrefs already allow.
  if (logoLink.startsWith('#')) {
    return (
      <button type="button" onClick={() => scrollTo(logoLink.slice(1))} className={`site-logo ${className}`}>
        {content}
      </button>
    )
  }
  return (
    <a href={logoLink} target="_blank" rel="noopener noreferrer" className={`site-logo ${className}`}>
      {content}
    </a>
  )
}
