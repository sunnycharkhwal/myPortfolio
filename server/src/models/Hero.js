import mongoose from 'mongoose'

// Public content — drives the portfolio's Hero section, the same "public reads, admin
// writes" split as Experience/Achievement/Education. Unlike those, this is a SINGLETON:
// exactly one Hero document ever exists (there's only one hero section on the page), not
// a list — enforced by the unique index on `user` below. The dashboard's HeroPanel.jsx
// always submits the full object; heroController.js's update always upserts, so there's
// no separate create step and nothing to seed by hand before first use.
const heroSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    // The small animated "Open to Opportunities" pill above the name.
    statusBadge: { type: String, required: true, trim: true },
    // Typewriter-cycled role titles ("$ DevOps Engineer", etc.) — plain strings, no
    // formatting, so free-text array is enough (no rich text needed for a role title).
    roles: { type: [String], default: [] },
    // Rich HTML (see RichTextEditor.jsx / src/utils/sanitizeRichText.js) — the intro
    // paragraph, including inline accent-color highlights on key phrases.
    bio: { type: String, default: '' },
    // The 3 stat tiles (years experience / projects delivered / uptime, etc.) — same
    // {value, label, color} shape Achievement already uses, just embedded here instead
    // of its own collection since these only ever appear attached to the Hero singleton.
    // `enabled` lets you hide one stat tile from the public site without deleting it
    // from the dashboard's list — same enforcement style as every other `enabled` field
    // in this app. Defaults `true` so tiles saved before this field existed stay visible.
    stats: [
      {
        _id: false,
        value: { type: String, required: true, trim: true },
        label: { type: String, required: true, trim: true },
        color: { type: String, required: true, trim: true },
        enabled: { type: Boolean, default: true },
      },
    ],
    // The orbiting tech-stack icons — iconKey resolves via src/utils/iconRegistry.js on
    // the frontend, same convention as Experience.tech. `enabled` same as stats above.
    techStack: [
      {
        _id: false,
        iconKey: { type: String, required: true },
        name: { type: String, required: true, trim: true },
        color: { type: String, required: true, trim: true },
        enabled: { type: Boolean, default: true },
      },
    ],
    // The "Download Resume" button's target — either a pasted URL or a base64 data-URI
    // (an uploaded file, read client-side via src/utils/fileToDataUrl.js), same duality
    // Project.downloads[].url already uses. Empty string means "not set from the
    // dashboard yet" — Hero.jsx falls back to the static /Sunny-Charkhwal-Resume.pdf in
    // that case rather than rendering a dead button.
    resumeUrl: { type: String, trim: true, default: '' },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Hero', heroSchema)
