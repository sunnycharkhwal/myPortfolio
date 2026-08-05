import mongoose from 'mongoose'

// Single admin user for the private dashboard. passwordHash and the reset-token fields
// are select:false so a plain `User.find()` never accidentally returns them — callers
// that genuinely need them (login, reset-password) opt in explicitly with .select('+passwordHash').
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    resetTokenHash: {
      type: String,
      select: false,
    },
    resetTokenExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)
