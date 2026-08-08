import mongoose from 'mongoose'

// Public content — the degree cards on the portfolio's Experience section. No icon
// field: Experience.jsx keeps one shared, hardcoded FaGraduationCap for every row,
// matching the static data's behavior exactly. Reads are public; only writes require auth.
const educationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    field: {
      type: String,
      required: true,
      trim: true,
    },
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    period: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    // Disabling hides this entry from the public site without deleting it — same
    // enforcement style as ProjectCategory.enabled/ContentPreset.enabled.
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

export default mongoose.model('Education', educationSchema)
