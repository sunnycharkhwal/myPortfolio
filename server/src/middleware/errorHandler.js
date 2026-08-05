import { env } from '../config/env.js'

// Central Express error handler — mounted last in app.js. Normalizes the handful of
// Mongoose error shapes we actually hit into clean 400/409 responses; everything else
// is a 500 with a generic message in production (stack traces only show in dev).
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message })
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid identifier' })
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Already exists' })
  }

  console.error(err)
  const status = err.statusCode || 500
  res.status(status).json({
    message: status === 500 && env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  })
}
