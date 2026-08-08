import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import {
  listContactServices,
  getContactService,
  createContactService,
  updateContactService,
  deleteContactService,
} from '../controllers/contactServiceController.js'

const router = Router()

// Public reads (the portfolio's Contact section, no login) — protected writes
// (dashboard only). Same per-route split as achievementRoutes.js/skillCategoryRoutes.js.
router.get('/', listContactServices)
router.get('/:id', getContactService)
router.post('/', protect, createContactService)
router.put('/:id', protect, updateContactService)
router.delete('/:id', protect, deleteContactService)

export default router
