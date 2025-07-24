import express from 'express'
import { loginWithPhone, logout, refreshAccessToken, sendOTP } from '../controllers/userController.js';

const router = express.Router();

router.post('/send-otp', sendOTP)
router.post('/login', loginWithPhone)
router.post('/refresh-token', refreshAccessToken)
router.post('/logout', logout)

export default router;  