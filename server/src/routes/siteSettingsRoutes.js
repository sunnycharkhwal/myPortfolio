import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { getSiteSettings, getSiteSettingsForEdit, updateSiteSettings } from '../controllers/siteSettingsController.js'

const router = Router()

// Public read (every public page) vs protected read (the dashboard's edit form needs
// the doc regardless of whether it's been saved yet) — same split as heroRoutes.js.
router.get('/', getSiteSettings)
router.get('/manage', protect, getSiteSettingsForEdit)
router.put('/', protect, updateSiteSettings)

export default router
