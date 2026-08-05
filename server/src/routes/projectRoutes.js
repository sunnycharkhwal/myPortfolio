import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js'

const router = Router()

// Public reads (portfolio page, no login) — protected writes (dashboard only). Same
// per-route split as experienceRoutes.js — this resource is public content now, not
// the private admin-only entity it used to be, so it can no longer use a blanket
// router.use(protect).
router.get('/', listProjects)
router.get('/:id', getProject)
router.post('/', protect, createProject)
router.put('/:id', protect, updateProject)
router.delete('/:id', protect, deleteProject)

export default router
