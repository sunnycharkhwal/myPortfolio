import mongoose from 'mongoose'

// Reusable snippets the admin can attach to a project's Objective / Steps / Tech-or-AWS /
// Outcomes fields from the dashboard instead of retyping them — selecting one still lands
// as plain editable text/rows in the form (see ProjectFormModal.jsx), never a locked
// reference, so a preset is always a starting point, not a constraint. Admin-only content:
// never read by the public site, unlike ProjectCategory/Experience/etc.
//
// `kind` distinguishes the four field types this feeds. 'tech' is deliberately one shared
// list for both Project.techStack (frontend) and Project.aws (devops) rather than two
// separate kinds — a service name like "Docker" is equally valid in either context, and
// the project form already keeps those two fields mutually exclusive by `group`.
//
// `group` scopes a preset to one project group (a top-level ProjectCategory, e.g.
// "frontend"/"devops") — same slug convention as Project.group and ProjectCategory.slug
// (parent: null). This is what makes a Frontend project's pickers only ever offer
// Frontend-tagged presets, not the whole library — see contentPresetController.js's
// validateGroup for the write-time check against real ProjectCategory groups.
const contentPresetSchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      required: true,
      enum: ['objective', 'step', 'tech', 'outcome'],
    },
    group: {
      type: String,
      required: true,
      trim: true,
    },
    // Used by every kind except 'step' (objective/tech/outcome are single strings).
    text: {
      type: String,
      trim: true,
    },
    // Used only when kind === 'step' — mirrors Project.steps' own {title, text} shape.
    // `stepText` may contain literal <strong> markup, same authoring convention as
    // Project.steps.text.
    stepTitle: { type: String, trim: true },
    stepText: { type: String },
    enabled: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('ContentPreset', contentPresetSchema)
