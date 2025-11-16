import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();

router.post("/auth/request-reset", AuthController.requestReset)

router.post("/auth/reset-password", AuthController.resetPassowrd)

router.get(
  '/auth/google/connect',
  AuthController.googleConnect
);

router.get(
  '/auth/google/login',
  AuthController.googleLogin
);

router.get(
  '/auth/google/register',
  AuthController.googleRegister
);

router.get(
  '/auth/google/callback',
  AuthController.googleCallback
);

router.get(
  '/auth/spotify/connect',
  AuthController.spotifyConnect
);

router.get(
  '/auth/spotify/login',
  AuthController.spotifyLogin
);

router.get(
  '/auth/spotify/register',
  AuthController.spotifyRegister
);

router.get(
  '/auth/spotify/callback',
  AuthController.spotifyCallback
);

router.post(
  '/auth/register',
  AuthController.localRegister
);

router.post(
  '/auth/login',
  AuthController.localLogin
);

export default router;