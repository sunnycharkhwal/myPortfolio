import crypto from 'node:crypto'

// The raw token is emailed to the user once and never stored. Only its hash is kept in
// the DB, so a database leak alone can't be used to replay a still-valid reset link.
export function hashToken(rawToken) {
  return crypto.createHash('sha256').update(rawToken).digest('hex')
}

export function generateResetToken(expiresInMinutes) {
  const rawToken = crypto.randomBytes(32).toString('hex')
  return {
    rawToken,
    tokenHash: hashToken(rawToken),
    expiresAt: new Date(Date.now() + expiresInMinutes * 60 * 1000),
  }
}
