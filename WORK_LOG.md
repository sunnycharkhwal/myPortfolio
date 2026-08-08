{% raw %}
# Work Log

Running log of changes made in this project via Claude. Keeps the **last 5 entries only**
(oldest is dropped when a 6th is added). Reference an entry by its `#id` — e.g. "revert
update #3" — and I'll use the "Before → After" section below to reverse it precisely,
no need to re-explain what it was.

IDs are monotonically increasing and never reused, even as older entries roll off, so a
number always means the same thing.

Note: entries here are **not** tied to git commits — per standing instructions, nothing
in this repo gets committed/pushed unless explicitly asked. Revert is done by re-editing
files back to the recorded "before" state, not `git revert`.

---





## #8 — 2026-08-06 — Enable/disable everywhere + dashboard-managed resume

**What changed:** Three things —
1. Added an `enabled` toggle to every dashboard entity that didn't already have one
   (Project, Work History, Achievements, Education — Categories/Presets already had
   this). Disabling hides the item from the public site without deleting it, same
   pattern as Categories/Presets; each dashboard list row got an inline Switch for it.
2. Audited every delete action in the dashboard — all of them already went through
   `ConfirmDialog` before touching the server, nothing needed to change.
3. The Hero section's "Download Resume" button now points at a `resumeUrl` you manage
   from the dashboard's Hero tab (paste a URL or upload a PDF, same upload pattern as
   project images/downloads) instead of the hardcoded static file — falls back to the
   bundled `Sunny-Charkhwal-Resume.pdf` when empty.

**Files touched:**
- `server/src/models/Project.js` — modified: added a proper standalone `enabled` field.
  `linkEnabled` used to (confusingly) hide the WHOLE project when off, despite its name
  and label only ever describing the "Visit Project" button — restored it to that
  original, narrower meaning now that `enabled` does the whole-project hiding properly
- `server/src/models/Experience.js` / `Achievement.js` / `Education.js` — modified:
  added `enabled` (default `true`)
- `server/src/models/Hero.js` — modified: added `resumeUrl`
- `server/src/controllers/projectController.js` / `experienceController.js` /
  `achievementController.js` / `educationController.js` / `heroController.js` —
  modified: each `pickFields`-equivalent now accepts the new field
- `src/components/Projects.jsx` — modified: visibility filter
  `p.linkEnabled !== false` → `p.enabled !== false`
- `src/components/Experience.jsx` — modified: all three fetched arrays now filtered
  through `.filter(x => x.enabled !== false)` client-side (these endpoints are shared
  with the dashboard, unlike Project's public/manage split, so they return disabled
  entries too — filtering happens here, not server-side)
- `src/components/Hero.jsx` — modified: "Download Resume" button's `href`/`download`/
  `target`/`rel` now derived from `hero.resumeUrl` (falls back to the static file)
- `src/components/dashboard/ProjectFormModal.jsx` — modified: new standalone "Enabled"
  switch; "Link enabled" switch's label corrected to describe only the Visit-Project button
- `src/components/dashboard/ProjectCard.jsx` — modified: inline enable Switch, dims when
  disabled, `linkEnabled` row's stale "hidden from public site" copy corrected
- `src/components/dashboard/ProjectsPanel.jsx` — modified: `handleToggleEnabled`, wired
  into both `ProjectCard` render sites
- `src/components/dashboard/WorkHistoryFormModal.jsx` / `AchievementFormModal.jsx` /
  `EducationFormModal.jsx` — modified: each gained an Enabled switch
- `src/components/dashboard/WorkHistorySection.jsx` / `AchievementsSection.jsx` /
  `EducationSection.jsx` — modified: each row/card gained an inline enable Switch +
  `handleToggleEnabled`
- `src/components/dashboard/HeroPanel.jsx` — modified: new Resume field (URL input +
  PDF upload, 5MB cap, `MAX_RESUME_BYTES`), included in the saved payload

**Before → After (key changes):**
- `Project` schema: gained `enabled: { type: Boolean, default: true }` (separate from
  the pre-existing `linkEnabled`)
- `Projects.jsx` filter: `p.linkEnabled !== false` → `p.enabled !== false`
- `Experience.jsx`: `data.experience` / `data.achievements` / `data.education` used
  directly → each `.filter(x => x.enabled !== false)` first
- `Hero.jsx` resume button: hardcoded `href="/Sunny-Charkhwal-Resume.pdf"` →
  `href={hero.resumeUrl || '/Sunny-Charkhwal-Resume.pdf'}`

**Status:** applied

---

## #9 — 2026-08-06 — New Project now opens with the same editors Edit Project has

**What changed:** Confirmed via an actual browser run (Playwright, screenshots
compared side by side — not just reading the code) that Objective's rich-text editor
was always present and correct for both New and Edit. The real inconsistency was
Architecture & Steps / Key Outcomes: both are repeatable rows, and a brand new project
starts with zero rows, so **no editor renders at all** until "+ Add step"/"+ Add
outcome" is clicked — while an existing project already has rows, so its editors are
visible the instant the modal opens. That mismatch is what read as "the editor is
missing." Fixed by pre-seeding one empty row each when opening for a new project, so
New Project now visibly opens with an Objective editor, one Step editor, and one
Outcome editor — same as Edit Project. Still fully removable via the row's own delete
button; this isn't a hidden minimum.

**Files touched:**
- `src/components/dashboard/ProjectFormModal.jsx` — modified

**Before → After (key changes):**
- The new-project branch of the form-reset `useEffect`: `setStepRows([])` /
  `setOutcomeRows([])` → `setStepRows([{ title: '', text: '' }])` / `setOutcomeRows([''])`

**How this was verified:** started both dev servers, minted a short-lived admin JWT
directly (signed with the same `JWT_SECRET` the backend already trusts, matching
`authMiddleware.js`'s expectations) to skip needing the actual admin password, drove a
headless Chromium against the running app, and screenshotted New Project vs Edit
Project before and after the fix. `chromium-cli` wasn't available in this environment,
so this used a scratch Playwright install instead — worth turning into a proper project
skill via `/run-skill-generator` if you'll want this kind of visual check again.

**Status:** applied

---

## #10 — 2026-08-06 — Content-preset library was actually empty (root cause) — reseeded

**What changed:** This is a **data** fix, not a code fix — the picker code from #2/#3
was correct all along. Root cause: `npm run seed:content-presets` was never actually
run. Instead, 4 placeholder test docs existed in the collection (`"bv vb vb"`,
`"mnbbjn"`, etc. — clearly typed while trying out the Presets dashboard tab, not real
content), all tagged `group: 'frontend'`. Two compounding problems: (1) a brand new
project defaults to `group: 'devops'`, which had **zero** presets, so nothing ever
showed for the case you were actually hitting; (2) the seed script's own "skip if any
docs already exist" guard meant it would never self-heal — running it again silently
did nothing while those 4 junk docs were still there.

**What I did:** deleted the 4 placeholder docs, then ran `npm run seed:content-presets`
clean. It inserted 260 real presets this time — 12 objectives / 72 steps / 65 tech
names / 48 outcomes for DevOps, 4 / 24 / 19 / 16 for Frontend.

**How this was verified:** not just re-reading the code — queried MongoDB directly to
confirm the junk docs' actual content before deleting anything, re-ran the seed and
confirmed the insert counts, then drove a fresh headless-Chromium session against the
running dashboard and confirmed "+ Insert from library" / "+ Add from library" pickers
now render on a brand-new project's DevOps-group form (screenshotted), and cross-checked
against the live `GET /api/content-presets` response (12 DevOps objective presets, real
text, not placeholders).

**To revert:** there's no code diff here to undo. Reverting would mean deleting these
260 seeded docs again (`ContentPreset.deleteMany({})`) — say so if you actually want
that; otherwise this stays as your library going forward, editable/prunable from the
Presets tab like anything else there.

**Status:** applied

---

## #11 — 2026-08-06 — Hero: confirm-delete + per-item enable on Stats/Tech, verified live

**What changed:** Three asks, all Hero-scoped —
1. **"Display current Hero data"**: verified live in a real browser session (not
   assumed) — the panel already loaded correctly pre-filled (First name field showed
   "Sunny" etc.); no fix needed here, just confirmation it works.
2. **Delete confirmation**: HeroPanel's Role/Stat/Tech-icon × buttons removed a row
   immediately with no confirmation — the only unaudited delete surface left, since
   HeroPanel didn't exist yet during the earlier dashboard-wide delete audit. Now routed
   through the same `ConfirmDialog` everything else uses.
3. **Per-item enable/disable**: added to Stat tiles and Tech-stack icons (each is a
   visible individual element on the public page — a tile or an orbiting icon) — a
   Switch per row, same as Project/Achievement/Experience/Education already have.
   Deliberately **not** added to Roles: they're plain strings in a typewriter rotation,
   not individually-rendered elements, and converting `roles` from `[String]` to an
   object-per-item shape would've required migrating already-saved data for close to no
   real benefit — delete (with confirmation, per #2) already covers "I don't want this
   role anymore."

**Files touched:**
- `server/src/models/Hero.js` — modified: `stats[]` and `techStack[]` subdocs gained
  `enabled: { type: Boolean, default: true }` (defaults on read for existing docs
  missing the field, no migration needed)
- `server/src/controllers/heroController.js` — modified: `pickStatRows`/`pickTechRows`
  carry `enabled` through
- `src/components/Hero.jsx` — modified: added `visibleStats`/`visibleTechStack`
  (`.filter(x => x.enabled !== false)`), used everywhere `hero.stats`/`hero.techStack`
  used to render directly; orbit-cycling interval's dependency changed from the array
  itself to `.length` (the array is freshly derived every render now, so depending on
  the array reference would have restarted the interval on every render)
- `src/components/dashboard/HeroPanel.jsx` — modified: added a shared
  `deleteTarget`/`confirmRemove` flow (`{ kind: 'role'|'stat'|'tech', index }`) plus a
  `ConfirmDialog`; Stat/Tech rows gained an enable `Switch` and dim when disabled

**Before → After (key changes):**
- `HeroPanel.jsx`: `onClick={() => removeStatRow(i)}` (and role/tech equivalents) →
  `onClick={() => requestRemove('stat', i)}`, actual removal now happens in
  `confirmRemove` after the dialog's Delete button
- `Hero.jsx`: `hero.stats.map(...)` / `hero.techStack.slice(...)` →
  `visibleStats.map(...)` / `visibleTechStack.slice(...)`

**How this was verified:** live browser session again (not just code review) — Hero
tab screenshotted showing all fields pre-filled; clicked a stat tile's delete button
and confirmed the "Remove this item?" dialog actually appears (screenshotted);
confirmed 11 switch inputs on the page (3 stats + 8 tech icons, matching exactly).

**Status:** applied

---

## #12 — 2026-08-06 — Removed all inline CSS from the dashboard (public site out of scope)

**What changed:** Per the standing instruction "never use inline CSS going forward,"
went through every dashboard file (admin side only — `/dashboard`, `/login`,
`/forgot-password`, `/reset-password` — you chose "phase it, dashboard first"; the
public marketing site is a separate later pass) and moved every React `style={{...}}`
block into `src/scss/_dashboard.scss` as real `dash-`-prefixed classes. **MUI's `sx`
prop was explicitly left alone** — it's CSS-in-JS compiled by Emotion into real
stylesheet classes, not a literal inline `style=""` attribute, so it was never actually
"inline CSS" in the sense you meant. Three-tier approach: fully static styles → plain
classes; boolean/conditional state (active/disabled/enabled) → conditional class names;
genuinely dynamic per-instance values (an admin-entered hex color, a per-call-site
`minHeight`) → a CSS custom property set via a *minimal* `style={{'--x': value}}`,
consumed with `var(--x)` in the class — the same pattern `DevOpsBackground.jsx`/
`Hero.jsx` already used on the public site. One deliberate exception: `SortableItem.jsx`
keeps its dnd-kit `style={style}` as-is — it's a live per-frame drag transform with no
static equivalent, and matches dnd-kit's own documented usage.

Along the way, found and consolidated a lot of copy-pasted "chrome" that had been
inlined identically in 6+ files — dialog hairline/padding/title, error/success alert
banners, section-header + New-button rows, entry-row cards, color-swatch pickers — into
one shared class each instead of one-off classes per file. Also replaced the old JS
`` `${color}20` `` hex-alpha-suffix trick with CSS-native `color-mix(in srgb, var(--x)
12.5%, transparent)`, and Pagination's JS-computed disabled-button styling with the
native `:disabled` pseudo-class — both genuine simplifications, not just relocations.

**Files touched:** `src/scss/_dashboard.scss` (grew throughout, one section per
component, in conversion order) plus every dashboard component and page: `DragHandle`,
`Pagination`, `IconPicker`, `ProtectedRoute`, `DashboardPage`, `ExperiencePanel`,
`ConfirmDialog`, `ToastContainer`, `DashboardTopbar`, `LoginPage`,
`ForgotPasswordPage`, `ResetPasswordPage`, `AchievementFormModal`,
`EducationFormModal`, `WorkHistoryFormModal`, `ContentPresetFormModal`,
`ProjectCategoryFormModal`, `ProjectCard`, `WorkHistorySection`, `EducationSection`,
`AchievementsSection`, `ProjectCategoriesPanel`, `ContentPresetsPanel`,
`ProjectsPanel`, `RichTextEditor`, `ProjectFormModal`, `HeroPanel`. `SortableItem.jsx`
was reviewed and deliberately left unchanged (documented exception above).

**Before → After (key changes):** every `<div style={{ display: 'flex', ... }}>`-style
literal object became `<div className="dash-...">`; every per-instance color/size
became `style={{ '--x': value }}` + `var(--x)` in `_dashboard.scss`; boolean styling
(e.g. `opacity: disabled ? 0.55 : 1`) became a conditional class
(`` `dash-row${disabled ? ' dash-row--disabled' : ''}` ``).

**How this was verified:** `npm run build` after essentially every file (or small
batch), all clean — zero errors, only the pre-existing unrelated "chunk >500kB"
warning. Final sweep: `grep -rn "style={{" src/components/dashboard/*.jsx
src/pages/{DashboardPage,LoginPage,ForgotPasswordPage,ResetPasswordPage}.jsx
src/routes/ProtectedRoute.jsx` shows only the justified `--custom-property` usages
(colors/sizes) plus `SortableItem.jsx`'s documented dnd-kit exception — no leftover
static inline styling anywhere in the dashboard.

**Status:** applied — public site (Hero/Nav/Skills/Projects/Experience/Contact/
Footer/DevOpsBackground/SectionHeader/BackToTop/DownloadLinkButton) intentionally
untouched, to be scoped as its own follow-up when you're ready.
{% endraw %}
