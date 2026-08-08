import rateLimit from 'express-rate-limit'

// Covers all three sensitive auth endpoints — login and forgot-password are the obvious
// brute-force targets, but reset-password is also an unlimited-attempt token-guessing
// surface if left unlimited, so it gets the same treatment.
const message = { message: 'Too many attempts, please try again later.' }

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message,
})

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message,
})

export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message,
})

// A generic ceiling applied to every /api route in app.js, on top of the stricter
// limiters above (both apply independently — the tighter one triggers first). Every
// write endpoint already requires a valid JWT, so this isn't an access-control
// measure — it's a sane cap on how much any single client (a leaked/stolen token, a
// buggy script, a scanner) can hit the API before getting throttled.
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
})
