import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import {
  listExperience,
  getExperienceEntry,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../controllers/experienceController.js'

const router = Router()

// Unlike projectRoutes.js's blanket `router.use(protect)`, this resource is public
// content — real portfolio visitors read it with no login. Only writes need auth,
// so `protect` is applied per-route instead of to the whole router.
router.get('/', listExperience)
router.get('/:id', getExperienceEntry)
router.post('/', protect, createExperience)
router.put('/:id', protect, updateExperience)
router.delete('/:id', protect, deleteExperience)

export default router
