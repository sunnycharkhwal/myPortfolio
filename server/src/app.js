import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { env } from './config/env.js'
import authRoutes from './routes/authRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import projectCategoryRoutes from './routes/projectCategoryRoutes.js'
import experienceRoutes from './routes/experienceRoutes.js'
import achievementRoutes from './routes/achievementRoutes.js'
import educationRoutes from './routes/educationRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'

export const app = express()

// Explicit whitelist, never a wildcard — env.CORS_ORIGIN is already parsed into an array.
app.use(
  cors({
    origin: env.CORS_ORIGIN,
  })
)
// Default is 100kb — way too small once project images/downloads can be uploaded as
// base64 data-URIs (a single modestly-sized image is often several hundred KB to a few
// MB as base64). Bumped so those requests don't get silently rejected with a 413.
app.use(express.json({ limit: '15mb' }))

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/project-categories', projectCategoryRoutes)
// Public content (portfolio's Experience section) — reads are open, writes require
// auth. See routes/experienceRoutes.js for the per-route protect() split.
app.use('/api/experience', experienceRoutes)
app.use('/api/achievements', achievementRoutes)
app.use('/api/education', educationRoutes)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

// Must be mounted last — Express identifies error middleware by its 4-argument signature.
app.use(errorHandler)
