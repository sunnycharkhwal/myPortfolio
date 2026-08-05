import mongoose from 'mongoose'
import { env } from './env.js'

// Logs connection-state changes for the lifetime of the process — separate from the
// initial connect() call below, so a connection that drops *after* boot (Atlas failover,
// network blip) is visible in logs too, not just the first attempt.
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message)
})
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected')
})

export async function connectDB() {
  await mongoose.connect(env.MONGODB_URI)
  console.log('MongoDB connected')
}
