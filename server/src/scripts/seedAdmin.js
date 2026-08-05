import readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'
import { isValidEmail, isValidPassword, PASSWORD_POLICY_MESSAGE } from '../utils/validators.js'

const SALT_ROUNDS = 12

// One-time interactive script — not part of the HTTP app, not a public signup form.
// Re-runnable: matches by email and updates the password hash if the admin already
// exists, so resetting your own local admin password is just running this again.
// Note: terminal input is not masked (no extra dependency for that) — acceptable for a
// one-time local-only script, not something exposed over the network.
async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout })

  let email
  do {
    email = (await rl.question('Admin email: ')).trim()
    if (!isValidEmail(email)) console.log('  → not a valid email address, try again.')
  } while (!isValidEmail(email))

  let password
  do {
    password = await rl.question('Admin password: ')
    if (!isValidPassword(password)) console.log(`  → ${PASSWORD_POLICY_MESSAGE}`)
  } while (!isValidPassword(password))

  rl.close()

  await connectDB()

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
  const normalizedEmail = email.toLowerCase()

  const existing = await User.findOne({ email: normalizedEmail })
  if (existing) {
    existing.passwordHash = passwordHash
    await existing.save()
    console.log(`Admin user updated: ${normalizedEmail}`)
  } else {
    await User.create({ email: normalizedEmail, passwordHash })
    console.log(`Admin user created: ${normalizedEmail}`)
  }

  await mongoose.connection.close()
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
