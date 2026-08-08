import mongoose from 'mongoose'

// Public content — the Footer's "Quick Links" list (Home/Skills/Projects/Experience/
// Contact, each an in-page anchor). Reads are public; only writes require auth. Same
// "public reads, admin writes" split as Achievement/ContactService.
const footerLinkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    // An in-page anchor (e.g. "#skills") or a real absolute URL — both render
    // identically through a plain <a href>, same duality Project.link already allows.
    href: { type: String, required: true, trim: true },
    order: {
      type: Number,
      default: 0,
    },
    // Disabling hides this link from the Footer without deleting it — same enforcement
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

export default mongoose.model('FooterLink', footerLinkSchema)
