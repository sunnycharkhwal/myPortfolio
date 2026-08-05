import mongoose from 'mongoose'

// Admin-manageable project taxonomy — one model represents both levels: a top-level
// "group" (parent: null, e.g. Frontend/DevOps) and a "sub-category" nested under one
// (parent: <group's _id>, e.g. CI/CD under DevOps). Project.group/Project.category are
// plain strings that must match a group/sub-category `slug` here — see
// projectController.js's validateGroupAndCategory for the write-time check.
const projectCategorySchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    // Matches Project.group / Project.category exactly — changing a slug after
    // projects already reference it would silently orphan them, so the frontend
    // discourages editing it once created (still technically allowed here).
    slug: { type: String, required: true, trim: true, lowercase: true },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProjectCategory',
      default: null,
    },
    // Resolved via src/utils/iconRegistry.js on the frontend — same string-key
    // convention as Experience's iconKey, since neither Mongo nor JSON can hold a
    // React component reference.
    iconKey: { type: String, default: 'FaCode' },
    color: { type: String, default: '#00d4ff' },
    // Disabling hides this group/sub-category everywhere — the public filter bar and
    // any project that uses it (enforced client-side on the public site, see
    // Projects.jsx). The dashboard still shows disabled entries so they can be managed.
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

// Prevents duplicate slugs within the same parent scope (two sub-categories named
// "cicd" under the same group, or two groups both named "devops").
projectCategorySchema.index({ user: 1, parent: 1, slug: 1 }, { unique: true })

export default mongoose.model('ProjectCategory', projectCategorySchema)
