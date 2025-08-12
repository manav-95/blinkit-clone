import express from 'express'
import multer from "multer";
const upload = multer();
import { loginWithPhone, logout, refreshAccessToken, sendOTP, addAddress, getUserAddresses } from '../controllers/userController.js';

const router = express.Router();

router.post('/send-otp', sendOTP)
router.post('/login', loginWithPhone)
router.post('/refresh-token', refreshAccessToken)
router.post('/logout', logout)

router.post('/add-address', upload.none(), addAddress)
router.get('/:userId/userAddresses', getUserAddresses)

export default router;  