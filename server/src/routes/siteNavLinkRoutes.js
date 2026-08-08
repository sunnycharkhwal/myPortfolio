import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import {
  listSiteNavLinks,
  getSiteNavLink,
  createSiteNavLink,
  updateSiteNavLink,
  deleteSiteNavLink,
} from '../controllers/siteNavLinkController.js'

const router = Router()

// Public reads (the Nav bar, no login) — protected writes (dashboard only). Same
// per-route split as footerLinkRoutes.js.
router.get('/', listSiteNavLinks)
router.get('/:id', getSiteNavLink)
router.post('/', protect, createSiteNavLink)
router.put('/:id', protect, updateSiteNavLink)
router.delete('/:id', protect, deleteSiteNavLink)

export default router
