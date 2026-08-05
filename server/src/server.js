import mongoose from 'mongoose'
import { env } from './config/env.js'
import { connectDB } from './config/db.js'
import { app } from './app.js'

async function start() {
  try {
    await connectDB()
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message)
    process.exit(1)
  }

  const httpServer = app.listen(env.PORT, () => {
    console.log(`Server listening on port ${env.PORT}`)
  })

  // Render restarts free-tier containers on every deploy and after idle-sleep wake-up.
  // Without this, that restart is an abrupt kill: in-flight requests get dropped and the
  // Mongoose socket can be left in a bad state going into the next boot. This makes
  // shutdown deterministic instead of relying on the OS to just kill the process.
  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down gracefully...`)
    httpServer.close(async () => {
      console.log('HTTP server closed')
      try {
        await mongoose.connection.close()
        console.log('MongoDB connection closed')
      } catch (err) {
        console.error('Error closing MongoDB connection:', err.message)
      }
      process.exit(0)
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

start()
