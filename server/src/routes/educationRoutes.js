import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import {
  listEducation,
  getEducationEntry,
  createEducation,
  updateEducation,
  deleteEducation,
} from '../controllers/educationController.js'

const router = Router()

// Public reads, protected writes — see experienceRoutes.js for the rationale.
router.get('/', listEducation)
router.get('/:id', getEducationEntry)
router.post('/', protect, createEducation)
router.put('/:id', protect, updateEducation)
router.delete('/:id', protect, deleteEducation)

export default router
