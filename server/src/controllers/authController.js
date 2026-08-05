import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { env } from '../config/env.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { isValidEmail, isValidPassword, PASSWORD_POLICY_MESSAGE } from '../utils/validators.js'
import { generateResetToken, hashToken } from '../services/tokenService.js'
import { sendResetEmail } from '../services/emailService.js'

const SALT_ROUNDS = 12

function signToken(userId) {
  return jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN, algorithm: 'HS256' })
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {}

  if (!isValidEmail(email) || typeof password !== 'string' || password.length === 0) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  // Generic message on every failure path below — never reveal whether the account exists.
  const invalidCredentials = () => res.status(401).json({ message: 'Invalid email or password' })

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash')
  if (!user) return invalidCredentials()

  const matches = await bcrypt.compare(password, user.passwordHash)
  if (!matches) return invalidCredentials()

  res.json({ token: signToken(user._id) })
})

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body || {}

  // Always resolve to the same generic response, whether or not the email exists —
  // and even if the downstream Brevo call fails — so nothing about this endpoint's
  // response can be used to enumerate valid accounts.
  const genericResponse = () =>
    res.json({ message: 'If that email exists, a reset link has been sent.' })

  if (!isValidEmail(email)) return genericResponse()

  const user = await User.findOne({ email: email.toLowerCase().trim() })
  if (!user) return genericResponse()

  const { rawToken, tokenHash, expiresAt } = generateResetToken(env.RESET_TOKEN_EXPIRES_MIN)
  user.resetTokenHash = tokenHash
  user.resetTokenExpires = expiresAt
  await user.save()

  try {
    await sendResetEmail(user.email, rawToken)
  } catch (err) {
    // Logged for the human to notice; still returns the generic success response so a
    // Brevo outage can't be used to distinguish "email sent" from "email doesn't exist."
    console.error('Failed to send reset email:', err.message)
  }

  return genericResponse()
})

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body || {}

  if (typeof token !== 'string' || token.length === 0) {
    return res.status(400).json({ message: 'Invalid or expired token' })
  }
  if (!isValidPassword(newPassword)) {
    return res.status(400).json({ message: PASSWORD_POLICY_MESSAGE })
  }

  const user = await User.findOne({
    resetTokenHash: hashToken(token),
    resetTokenExpires: { $gt: new Date() },
  }).select('+resetTokenHash +resetTokenExpires')

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' })
  }

  user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS)
  user.resetTokenHash = undefined
  user.resetTokenExpires = undefined
  await user.save()

  res.json({ message: 'Password updated successfully' })
})

// Protected — exists mainly to prove `protect` middleware works end-to-end before
// Phase 3's real protected routes exist.
export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json({ id: user._id, email: user.email, createdAt: user.createdAt })
})
