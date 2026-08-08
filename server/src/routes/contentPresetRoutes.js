import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import {
  listContentPresets,
  getContentPreset,
  createContentPreset,
  updateContentPreset,
  deleteContentPreset,
} from '../controllers/contentPresetController.js'

const router = Router()

// Entirely protected, unlike projectRoutes.js/experienceRoutes.js — this is a
// dashboard-only authoring aid (the "attach a pre-defined item" library for the project
// form), never read by the public site, so there's no public-reads split here.
router.use(protect)

router.get('/', listContentPresets)
router.get('/:id', getContentPreset)
router.post('/', createContentPreset)
router.put('/:id', updateContentPreset)
router.delete('/:id', deleteContentPreset)

export default router
