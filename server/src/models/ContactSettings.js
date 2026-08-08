import mongoose from 'mongoose'

// Public content — the actual contact details (email/phone/LinkedIn/GitHub/location)
// used across the whole public site: the Contact section's mailto/tel/LinkedIn cards
// AND the Footer's social icons + email link. Single source of truth, same "public
// reads, admin writes" split as Hero — and, like Hero, a SINGLETON: exactly one
// document ever exists per user, enforced by the unique index on `user` below.
// contactSettingsController.js's update always upserts, so there's no separate create step.
const contactSettingsSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true },
    // Raw phone string used for the `tel:` link — no formatting, digits/+ only.
    phone: { type: String, required: true, trim: true },
    // Human-readable formatted version shown as visible text (e.g. "+91 901 303 0173")
    // — kept separate from `phone` since a `tel:` href needs no spaces/formatting but
    // the visible label reads better with them, same duality the original static data had.
    phoneDisplay: { type: String, required: true, trim: true },
    linkedinUrl: { type: String, trim: true, default: '' },
    // Short "@handle"-style display text for the LinkedIn card (e.g. "/in/sunnycharkhwal").
    linkedinHandle: { type: String, trim: true, default: '' },
    githubUrl: { type: String, trim: true, default: '' },
    // Shown in the Footer ("New Delhi, India").
    location: { type: String, trim: true, default: '' },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('ContactSettings', contactSettingsSchema)
