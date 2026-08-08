import mongoose from 'mongoose'

// Public content — the "How I Can Help You" service cards on the portfolio's Contact
// section (Cloud Architecture, CI/CD Pipelines, etc). Reads are public; only writes
// require auth. Same "public reads, admin writes" split as Achievement/SkillCategory.
const contactServiceSchema = new mongoose.Schema(
  {
    // A raw emoji/short glyph typed directly (e.g. "☁️"), matching the original static
    // data's exact authoring convention — unlike every other icon field in this app,
    // these were never react-icons components, so there's no iconKey/iconRegistry
    // lookup here, just a plain string rendered as-is.
    icon: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
    // Single admin-set color — the card's top hairline gradient is derived from this on
    // the frontend, same single-color-field convention SkillCategory.color/Achievement.color
    // already use, rather than storing the original two-tone `gradient` string verbatim.
    color: { type: String, required: true, trim: true },
    order: {
      type: Number,
      default: 0,
    },
    // Disabling hides this card from the public site without deleting it — same
    // enforcement style as every other `enabled` field in this app.
    enabled: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('ContactService', contactServiceSchema)
