import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import {
  listFooterLinks,
  getFooterLink,
  createFooterLink,
  updateFooterLink,
  deleteFooterLink,
} from '../controllers/footerLinkController.js'

const router = Router()

// Public reads (the Footer, no login) — protected writes (dashboard only). Same
// per-route split as achievementRoutes.js/contactServiceRoutes.js.
router.get('/', listFooterLinks)
router.get('/:id', getFooterLink)
router.post('/', protect, createFooterLink)
router.put('/:id', protect, updateFooterLink)
router.delete('/:id', protect, deleteFooterLink)

export default router
