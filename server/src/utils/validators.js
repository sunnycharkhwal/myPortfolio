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
