// Strips HTML tags for compact single-line previews (e.g. a preset's row in
// ContentPresetsPanel, or a project card summary) — never used for anything actually
// rendered as HTML, just a plain-text approximation for list/table display.
export function htmlToPlainText(html) {
  if (!html) return ''
  if (typeof DOMParser === 'undefined') {
    // SSR/non-browser fallback — good enough for a preview string, not exact.
    return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  }
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return (doc.body.textContent || '').replace(/\s+/g, ' ').trim()
}

// Tiptap's "empty" state is the string '<p></p>' (or similar), never a truly empty
// string — a plain `!value` / `.trim()` check that worked for a plain-text field would
// treat that as non-empty. Used wherever an HTML-valued field's emptiness needs
// checking: ProjectFormModal's validation, and Projects.jsx's "only render this section
// if the admin actually put something in it" conditionals.
export function isRichTextEmpty(html) {
  return htmlToPlainText(html).length === 0
}
