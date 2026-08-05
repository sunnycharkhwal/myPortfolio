import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import {
  listProjectCategories,
  listAllProjectCategories,
  createProjectCategory,
  updateProjectCategory,
  deleteProjectCategory,
} from '../controllers/projectCategoryController.js'

const router = Router()

// Public — enabled-only, drives the public site's filter bar. /manage is protected and
// returns everything (enabled + disabled) for the dashboard's Categories panel and the
// Project form's dropdowns. NOTE: /manage must be registered before /:id-style routes
// in case one is ever added — there are none here, so order doesn't currently matter,
// but keeping it first documents the intent.
router.get('/', listProjectCategories)
router.get('/manage', protect, listAllProjectCategories)
router.post('/', protect, createProjectCategory)
router.put('/:id', protect, updateProjectCategory)
router.delete('/:id', protect, deleteProjectCategory)

export default router
