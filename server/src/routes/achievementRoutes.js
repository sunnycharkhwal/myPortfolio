import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import {
  listAchievements,
  getAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from '../controllers/achievementController.js'

const router = Router()

// Public reads, protected writes — see experienceRoutes.js for the rationale.
router.get('/', listAchievements)
router.get('/:id', getAchievement)
router.post('/', protect, createAchievement)
router.put('/:id', protect, updateAchievement)
router.delete('/:id', protect, deleteAchievement)

export default router
