import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();

// Google OAuth
router.get('/auth/google/login', AuthController.googleLogin);
router.get('/auth/google/register', AuthController.googleRegister);
router.get('/auth/google/callback', AuthController.googleCallback);

// Spotify OAuth
router.get('/auth/spotify/login', AuthController.spotifyLogin);
router.get('/auth/spotify/register', AuthController.spotifyRegister);
router.get('/auth/spotify/callback', AuthController.spotifyCallback);

// Local (email/password)
router.post('/auth/register', AuthController.localRegister);
router.post('/auth/login', AuthController.localLogin);

export default router;