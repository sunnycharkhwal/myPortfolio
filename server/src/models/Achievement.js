import mongoose from 'mongoose'

// Public content — the small stat tiles ("15+ Features Shipped") on the portfolio's
// Experience section. Reads are public; only writes require auth.
const achievementSchema = new mongoose.Schema(
  {
    // Resolves to a real icon component via src/utils/iconRegistry.js on the frontend.
    // Renamed from the static data's lowercase `icon` to `iconKey` for consistency
    // with Experience.tech and Education — an internal naming choice only.
    iconKey: {
      type: String,
      required: true,
    },
    // Stays a string, not a Number — values are mixed formats like "15+" / "30%".
    value: {
      type: String,
      required: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    // Disabling hides this tile from the public site without deleting it — same
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

export default mongoose.model('Achievement', achievementSchema)
