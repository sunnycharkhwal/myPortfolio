import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import {
  listSkillCategories,
  getSkillCategory,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
} from '../controllers/skillCategoryController.js'

const router = Router()

// Public reads (the portfolio's Tech Stack section, no login) — protected writes
// (dashboard only). Same per-route split as experienceRoutes.js/achievementRoutes.js.
router.get('/', listSkillCategories)
router.get('/:id', getSkillCategory)
router.post('/', protect, createSkillCategory)
router.put('/:id', protect, updateSkillCategory)
router.delete('/:id', protect, deleteSkillCategory)

export default router
