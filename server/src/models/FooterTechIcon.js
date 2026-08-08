import mongoose from 'mongoose'

// Public content — the small row of tech icons in the Footer's divider strip (Docker/
// Kubernetes/Terraform/AWS/Jenkins/Prometheus). Reads are public; only writes require
// auth. Same "public reads, admin writes" split as Achievement/ContactService.
const footerTechIconSchema = new mongoose.Schema(
  {
    // Resolves to a real icon component via src/utils/iconRegistry.js on the frontend —
    // same string-key convention as every other iconKey field in this app.
    iconKey: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    order: {
      type: Number,
      default: 0,
    },
    // Disabling hides this icon from the Footer without deleting it — same enforcement
    // style as every other `enabled` field in this app.
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

export default mongoose.model('FooterTechIcon', footerTechIconSchema)
