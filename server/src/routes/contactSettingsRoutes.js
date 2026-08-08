import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { getContactSettings, getContactSettingsForEdit, updateContactSettings } from '../controllers/contactSettingsController.js'

const router = Router()

// Public read (the portfolio page itself) vs protected read (the dashboard's edit form
// needs the doc regardless of whether it's been saved yet) — same split as heroRoutes.js.
router.get('/', getContactSettings)
router.get('/manage', protect, getContactSettingsForEdit)
router.put('/', protect, updateContactSettings)

export default router
