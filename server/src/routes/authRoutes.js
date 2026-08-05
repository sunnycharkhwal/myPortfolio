import { Router } from 'express'
import { login, forgotPassword, resetPassword, me } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'
import { loginLimiter, forgotPasswordLimiter, resetPasswordLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.post('/login', loginLimiter, login)
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword)
router.post('/reset-password', resetPasswordLimiter, resetPassword)
router.get('/me', protect, me)

export default router
