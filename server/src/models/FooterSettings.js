import mongoose from 'mongoose'

// Public content — the Footer's own brand copy (name/role/bio/terminal line), as
// opposed to FooterLink/FooterTechIcon (the two repeatable lists) and ContactSettings
// (the actual email/phone/LinkedIn/GitHub/location, already shared with the Contact
// section). Same "public reads, admin writes" split as Hero — and, like Hero, a
// SINGLETON: exactly one document ever exists per user, enforced by the unique index
// on `user` below.
const footerSettingsSchema = new mongoose.Schema(
  {
    // The name shown next to the terminal-icon logo, and in "© <year> <brandName>".
    brandName: { type: String, required: true, trim: true },
    // The small mono-font line under the name (e.g. "DevOps Engineer").
    brandRole: { type: String, required: true, trim: true },
    bio: { type: String, trim: true, default: '' },
    // The typed-out command in the little terminal box (e.g. 'echo "Thanks for visiting!"').
    terminalCommand: { type: String, trim: true, default: '' },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('FooterSettings', footerSettingsSchema)
