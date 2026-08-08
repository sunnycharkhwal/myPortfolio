import mongoose from 'mongoose'

// Public content — this drives the portfolio's actual Experience section (work
// history), unlike Project/Expense which are private admin-only data. Reads are
// public (see routes/experienceRoutes.js); only writes require auth.
const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    // Free-text range (e.g. "Dec 2024 – Present") — matches the static data's shape,
    // not split into startDate/endDate.
    period: {
      type: String,
      required: true,
      trim: true,
    },
    points: {
      type: [String],
      default: [],
    },
    current: {
      type: Boolean,
      default: false,
    },
    // iconKey resolves to a real component via src/utils/iconRegistry.js on the
    // frontend — neither Mongo nor JSON can store a React component reference.
    tech: [
      {
        _id: false,
        iconKey: { type: String, required: true },
        name: { type: String, required: true, trim: true },
        color: { type: String, required: true, trim: true },
      },
    ],
    // Explicit admin-controlled display order, not insertion order.
    order: {
      type: Number,
      default: 0,
    },
    // Disabling hides this entry from the public site without deleting it — same
    // enforcement style as ProjectCategory.enabled/ContentPreset.enabled. The dashboard
    // still shows disabled entries so they can be re-enabled or edited.
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

export default mongoose.model('Experience', experienceSchema)
