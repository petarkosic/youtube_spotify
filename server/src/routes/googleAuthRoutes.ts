import { Router } from 'express';
import GoogleAuthController from '../controllers/googleAuthController';

const router = Router();

router.get('/login', GoogleAuthController.handleLogin);
router.get('/callback', GoogleAuthController.handleCallback);
router.get('/refresh_token', GoogleAuthController.handleRefreshToken);

export default router;
