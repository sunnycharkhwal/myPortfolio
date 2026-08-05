import dotenv from 'dotenv'

dotenv.config()

// Every other file reads config through this object — never `process.env` directly.
// That keeps env access centralized and makes it obvious at boot if something is missing,
// instead of failing confusingly deep inside a request handler.
const required = [
  'MONGODB_URI',
  'JWT_SECRET',
  'CORS_ORIGIN',
  'BREVO_API_KEY',
  'BREVO_SENDER_EMAIL',
]

const missing = required.filter((key) => !process.env[key] || process.env[key].trim() === '')
if (missing.length > 0) {
  console.error(`Missing required environment variable(s): ${missing.join(', ')}`)
  console.error('Copy server/.env.example to server/.env and fill in every value.')
  process.exit(1)
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  // Not 5000 — macOS's AirPlay Receiver squats on that port by default.
  PORT: Number(process.env.PORT) || 5001,

  MONGODB_URI: process.env.MONGODB_URI,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  RESET_TOKEN_EXPIRES_MIN: Number(process.env.RESET_TOKEN_EXPIRES_MIN) || 15,

  CORS_ORIGIN: process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean),

  BREVO_API_KEY: process.env.BREVO_API_KEY,
  BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL,
  BREVO_SENDER_NAME: process.env.BREVO_SENDER_NAME || 'Portfolio Admin',

  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
}
