import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import {
  listFooterTechIcons,
  getFooterTechIcon,
  createFooterTechIcon,
  updateFooterTechIcon,
  deleteFooterTechIcon,
} from '../controllers/footerTechIconController.js'

const router = Router()

// Public reads (the Footer, no login) — protected writes (dashboard only). Same
// per-route split as achievementRoutes.js/contactServiceRoutes.js.
router.get('/', listFooterTechIcons)
router.get('/:id', getFooterTechIcon)
router.post('/', protect, createFooterTechIcon)
router.put('/:id', protect, updateFooterTechIcon)
router.delete('/:id', protect, deleteFooterTechIcon)

export default router
