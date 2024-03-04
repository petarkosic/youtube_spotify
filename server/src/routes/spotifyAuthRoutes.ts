import { Router } from 'express';
import SpotifyAuthController from '../controllers/spotifyAuthController';

const router = Router();

router.get('/login', SpotifyAuthController.handleLogin);
router.get('/callback', SpotifyAuthController.handleCallback);
router.get('/refresh_token', SpotifyAuthController.handleRefreshToken);

export default router;
