// Plain regex, no dependency (joi/zod are deferred to a later hardening phase).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Minimum 8 characters, at least one letter, at least one number. Kept as a single
// exported check so it can be reused everywhere a password is set — resetPassword and
// seedAdmin both call this so the policy can never drift between the two call sites.
const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/

export function isValidEmail(value) {
  return typeof value === 'string' && EMAIL_RE.test(value.trim())
}

export function isValidPassword(value) {
  return typeof value === 'string' && PASSWORD_RE.test(value)
}

export const PASSWORD_POLICY_MESSAGE =
  'Password must be at least 8 characters and include at least one letter and one number.'

// Every admin-settable link/URL field (Hero.resumeUrl, Project.link, Project.downloads[].url,
// FooterLink.href, SiteNavLink.href, SiteSettings.logoLink, ContactSettings.linkedinUrl/
// githubUrl) ends up rendered as a real <a href>/<img src> on the PUBLIC site — without a
// scheme check, a `javascript:` value would execute in a VISITOR's browser when clicked,
// not just the admin's own. Empty is always allowed (means "not set", callers fall back to
// their own default).
const SAFE_URL_RE = /^(https?:|mailto:|tel:|#|\/)/i
// Same, but also allows `data:` — for the two fields that legitimately hold an uploaded
// file's base64 data-URI (Hero.resumeUrl, Project.downloads[].url) and are always rendered
// with a `download` attribute rather than a bare navigable link.
const SAFE_DOWNLOAD_URL_RE = /^(https?:|mailto:|tel:|#|\/|data:)/i

export function isSafeUrl(value) {
  if (!value) return true
  return SAFE_URL_RE.test(String(value).trim())
}

export function isSafeDownloadUrl(value) {
  if (!value) return true
  return SAFE_DOWNLOAD_URL_RE.test(String(value).trim())
}

export const UNSAFE_URL_MESSAGE = 'Only http(s), mailto, tel, #anchor, or relative links are allowed.'
