import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

// Verifies the Bearer JWT and attaches { id } to req.user. Kept minimal (just the id) —
// controllers that need the full user document re-fetch it themselves (see authController.me),
// so this middleware never does a DB round-trip on every protected request.
export function protect(req, res, next) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Not authorized' })
  }

  try {
    // Pinning the algorithm is defense-in-depth, not a fix for an active bug — it
    // removes any dependency on the library's default accepted-algorithm behavior.
    const decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] })
    req.user = { id: decoded.id }
    next()
  } catch {
    return res.status(401).json({ message: 'Not authorized' })
  }
}
