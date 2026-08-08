import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { getHero, getHeroForEdit, updateHero } from '../controllers/heroController.js'

const router = Router()

// Public read (the portfolio page itself) vs protected read (the dashboard's edit form
// needs the doc regardless of who currently owns it being irrelevant — same doc either
// way, but /manage exists so a future multi-admin setup wouldn't need a route change).
router.get('/', getHero)
router.get('/manage', protect, getHeroForEdit)
router.put('/', protect, updateHero)

export default router
