import DOMPurify from 'dompurify'

// Shared by every place a dashboard-authored RichTextEditor.jsx field gets rendered on
// the public site (Projects.jsx's objective/step-text/outcomes, Hero.jsx's bio) —
// sanitizes before ever reaching dangerouslySetInnerHTML. Allow-listing the exact tags/
// attributes the editor's toolbar can actually produce, rather than trusting DOMPurify's
// default profile, keeps this tied to what RichTextEditor.jsx offers instead of quietly
// growing if that ever changes. `style` is allowed only for the Color extension's
// `<span style="color: ...">` highlights — DOMPurify still strips dangerous values
// (url(), expression(), etc.) out of whatever `style` content it does allow through.
const RICH_TEXT_TAGS = ['p', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li', 'blockquote', 'br', 'span']
const RICH_TEXT_ATTR = ['href', 'target', 'rel', 'style']

export function sanitizeRichText(html) {
  return DOMPurify.sanitize(html || '', { ALLOWED_TAGS: RICH_TEXT_TAGS, ALLOWED_ATTR: RICH_TEXT_ATTR })
}
