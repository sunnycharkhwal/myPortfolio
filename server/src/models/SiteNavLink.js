import mongoose from 'mongoose'

// Public content — the Nav bar's link list (Home/Skills/Projects/Experience/Contact).
// Reads are public; only writes require auth. Same shape/rationale as FooterLink —
// deliberately its own collection rather than reusing FooterLink, since the Nav bar and
// Footer are independent UI zones an admin may want to diverge (e.g. a Nav-only link
// that shouldn't also appear in the Footer, or vice versa).
const siteNavLinkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    // An in-page anchor (e.g. "#skills") or a real absolute URL — both render
    // identically through a plain <a href>/onClick scroll, same duality FooterLink.href
    // already allows.
    href: { type: String, required: true, trim: true },
    order: {
      type: Number,
      default: 0,
    },
    // Disabling hides this link from the Nav bar without deleting it — same
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

export default mongoose.model('SiteNavLink', siteNavLinkSchema)
