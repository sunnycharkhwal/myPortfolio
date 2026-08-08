import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { getFooterSettings, getFooterSettingsForEdit, updateFooterSettings } from '../controllers/footerSettingsController.js'

const router = Router()

// Public read (the Footer itself) vs protected read (the dashboard's edit form needs
// the doc regardless of whether it's been saved yet) — same split as heroRoutes.js.
router.get('/', getFooterSettings)
router.get('/manage', protect, getFooterSettingsForEdit)
router.put('/', protect, updateFooterSettings)

export default router
