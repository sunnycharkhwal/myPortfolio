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
