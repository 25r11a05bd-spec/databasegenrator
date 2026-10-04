import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/confirm', AuthController.confirm);
router.post('/resend-verification', AuthController.resendVerification);
router.get('/verify', AuthController.verifyEmail);
router.post('/logout', AuthController.logout);

export default router;
