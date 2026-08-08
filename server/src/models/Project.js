import mongoose from 'mongoose'

// Public content — this drives the portfolio's actual Projects section (case studies),
// replacing what used to be a private admin-only tracking entity. Reads are public (see
// routes/projectRoutes.js); only writes require auth. `group`/`category` are plain
// strings validated against the admin-manageable ProjectCategory collection (see
// projectController.js) rather than a hardcoded enum, since the taxonomy itself is now
// database-backed and editable from the dashboard.
const stepSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    // May contain literal <strong> markup, typed by hand — matches the existing
    // authoring convention; rendered via renderStepText() on the frontend, not raw HTML.
    text: { type: String, required: true },
  },
  { _id: false }
)

// One repeatable "download" button — `url` is either a real pasted URL or a base64
// data-URI (an uploaded file, read client-side via src/utils/fileToDataUrl.js). Both
// work identically with a plain <a download> tag, so no separate "type" field needed.
const downloadSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true },
  },
  { _id: false }
)

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    group: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    // Auto-filled by the form from the chosen category's label, stored (not looked up
    // live) — matches the existing static data shape exactly.
    catLabel: { type: String, required: true, trim: true },
    images: {
      type: [String],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'At least one image is required',
      },
    },
    objective: { type: String, required: true },
    steps: {
      type: [stepSchema],
      default: [],
    },
    // Mutually exclusive, enforced in the controller based on `group` — Mongoose has no
    // declarative "exactly one of these two fields" validator.
    techStack: { type: [String], default: undefined },
    aws: { type: [String], default: undefined },
    outcomes: {
      type: [String],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'At least one outcome is required',
      },
    },
    order: {
      type: Number,
      default: 0,
    },
    // Disabling hides the WHOLE project from the public site without deleting it —
    // same enforcement style as ProjectCategory.enabled/ContentPreset.enabled. Separate
    // from `linkEnabled` below, which only ever controlled the "Visit Project" button —
    // it used to also be (mis)used to hide the entire project, which is what this field
    // now does properly instead.
    enabled: { type: Boolean, default: true },
    // Optional "visit this project" URL — `link`/`linkEnabled` together control ONLY
    // whether the "Visit Project" button renders in the project's detail view; they no
    // longer affect whether the project itself is listed (see `enabled` above for that).
    link: { type: String, trim: true, default: '' },
    linkEnabled: { type: Boolean, default: true },
    // Admin-managed, repeatable — in addition to (not instead of) the always-present
    // auto-generated "Download Case Study" PDF button, which has no stored data at all.
    downloads: {
      type: [downloadSchema],
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Project', projectSchema)
