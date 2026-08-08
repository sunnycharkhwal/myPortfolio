import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { getSkillsSection, getSkillsSectionForEdit, updateSkillsSection } from '../controllers/skillsSectionController.js'

const router = Router()

// Public read (the portfolio page itself) vs protected read (the dashboard's edit form
// needs the doc regardless of whether it's been saved yet) — same split as heroRoutes.js.
router.get('/', getSkillsSection)
router.get('/manage', protect, getSkillsSectionForEdit)
router.put('/', protect, updateSkillsSection)

export default router
