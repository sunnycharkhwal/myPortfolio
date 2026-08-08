import mongoose from 'mongoose'

// Public content — site-wide chrome that doesn't belong to any one section: the logo
// shown in the Nav bar (and anywhere else the public site displays it), plus each
// numbered section's own heading text/number and whole-section visibility toggle. Same
// "public reads, admin writes" split as Hero — and, like Hero, a SINGLETON: exactly one
// document ever exists per user, enforced by the unique index on `user` below.
//
// `sections` is a fixed, known set (not a repeatable list like FooterLink/ContactService)
// — every portfolio page has exactly these five, so a plain nested object is simpler and
// safer here than an array the frontend would have to look up by key.
const siteSettingsSchema = new mongoose.Schema(
  {
    // 'text' renders `logoText` as styled text; 'image' renders `logoImageUrl` inside a
    // fixed-size, object-fit:contain box so an uploaded image can never distort/stretch
    // or look pixelated at a size it wasn't designed for (see SiteLogo.jsx).
    logoType: { type: String, enum: ['text', 'image'], default: 'text' },
    logoText: { type: String, trim: true, default: 'SC://dev' },
    // A base64 data-URI (uploaded) or a real URL — same duality Project.images already uses.
    logoImageUrl: { type: String, trim: true, default: '' },
    // Where clicking the logo goes — an in-page anchor by default, but any URL works,
    // same duality FooterLink.href already allows.
    logoLink: { type: String, trim: true, default: '#hero' },
    sections: {
      _id: false,
      hero: {
        _id: false,
        enabled: { type: Boolean, default: true },
      },
      skills: {
        _id: false,
        enabled: { type: Boolean, default: true },
        title: { type: String, trim: true, default: 'Tech Stack' },
        num: { type: String, trim: true, default: '01' },
      },
      projects: {
        _id: false,
        enabled: { type: Boolean, default: true },
        title: { type: String, trim: true, default: 'Project' },
        num: { type: String, trim: true, default: '02' },
      },
      experience: {
        _id: false,
        enabled: { type: Boolean, default: true },
        title: { type: String, trim: true, default: 'Experience' },
        num: { type: String, trim: true, default: '03' },
      },
      contact: {
        _id: false,
        enabled: { type: Boolean, default: true },
        title: { type: String, trim: true, default: 'Get In Touch' },
        num: { type: String, trim: true, default: '04' },
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('SiteSettings', siteSettingsSchema)
