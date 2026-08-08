import mongoose from 'mongoose'

// Public content — the copy AROUND the Skills grid on the public site (the intro
// tagline, the 3 stat tiles below the grid, and the terminal-style footer line), as
// opposed to SkillCategory.js which holds the grid's actual category/technology data.
// Same "public reads, admin writes" split as Hero — and, like Hero, a SINGLETON: exactly
// one document ever exists per user (there's only one Skills section on the page),
// enforced by the unique index on `user` below. skillsSectionController.js's update
// always upserts, so there's no separate create step.
const skillsSectionSchema = new mongoose.Schema(
  {
    // Rich HTML (see RichTextEditor.jsx / src/utils/sanitizeRichText.js) — the intro
    // paragraph above the category grid, including inline accent-color highlights on
    // key words, same convention as Hero.bio.
    tagline: { type: String, default: '' },
    // The 3 tiles below the grid (Technologies / Categories / Learning in the original
    // design) — fully admin-editable free text, same {value, label, color, enabled}
    // shape as Hero.stats, deliberately NOT auto-computed from SkillCategory data so an
    // admin can relabel/reorder/hide them same as any other Hero-style stat tile.
    stats: [
      {
        _id: false,
        value: { type: String, required: true, trim: true },
        label: { type: String, required: true, trim: true },
        color: { type: String, required: true, trim: true },
        enabled: { type: Boolean, default: true },
      },
    ],
    // The "$ <command>" line at the bottom — just the command text, the "$" prefix and
    // blinking cursor are static chrome rendered around it on the frontend.
    footerCommand: { type: String, trim: true, default: '' },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('SkillsSection', skillsSectionSchema)
