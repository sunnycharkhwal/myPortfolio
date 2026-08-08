import mongoose from 'mongoose'

// Public content — drives the portfolio's Tech Stack (Skills) section. Reads are
// public; only writes require auth. Same "public reads, admin writes" split as
// Experience/Achievement/Education/Hero.
//
// Two-level shape, matching the original static data (src/data/skills.js): a category
// (e.g. "Cloud", "Containers") holds an icon/color/order/enabled of its own, plus a
// list of individual technology tags (e.g. "AWS", "EC2") — each tag gets its own
// `enabled` too, so a single technology can be hidden without hiding (or deleting) the
// whole category, same enforcement style as Hero's stats/techStack subdocs.
const skillTagSchema = new mongoose.Schema(
  {
    _id: false,
    // Resolves to a real icon component via src/utils/iconRegistry.js on the frontend —
    // same string-key convention as every other iconKey field in this app.
    iconKey: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    enabled: { type: Boolean, default: true },
  },
)

const skillCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    iconKey: { type: String, required: true },
    // Single admin-set color, same as Achievement/Hero.stats — the card's gradient
    // accents are derived from this on the frontend (color + a lighter/alpha variant)
    // rather than storing a second "gradient" field, matching the single-color-field
    // convention used everywhere else (ProjectCategory, Achievement, Hero subdocs).
    color: { type: String, required: true, trim: true },
    tags: {
      type: [skillTagSchema],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
    // Disabling hides the WHOLE category (and its tags) from the public site without
    // deleting it — same enforcement style as every other `enabled` field in this app.
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

export default mongoose.model('SkillCategory', skillCategorySchema)
