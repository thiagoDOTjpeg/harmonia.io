import { Router } from 'express';
import {
  LoginSchema,
  OAuthCallbackSchema,
  OAuthQuerySchema,
  RegisterSchema,
} from '../../../../application/dto/auth/schemas';
import { AuthController } from '../controllers/AuthController';
import { validateBody, validateQuery } from '../middlewares/ZodMiddleware';

const router = Router();

router.get(
  '/auth/google/login',
  validateQuery(OAuthQuerySchema),
  AuthController.googleLogin
);

router.get(
  '/auth/google/register',
  validateQuery(OAuthQuerySchema),
  AuthController.googleRegister
);

router.get(
  '/auth/google/callback',
  validateQuery(OAuthCallbackSchema),
  AuthController.googleCallback
);

router.get(
  '/auth/spotify/login',
  validateQuery(OAuthQuerySchema),
  AuthController.spotifyLogin
);

router.get(
  '/auth/spotify/register',
  validateQuery(OAuthQuerySchema),
  AuthController.spotifyRegister
);

router.get(
  '/auth/spotify/callback',
  validateQuery(OAuthCallbackSchema),
  AuthController.spotifyCallback
);

router.post(
  '/auth/register',
  validateBody(RegisterSchema),
  AuthController.localRegister
);

router.post(
  '/auth/login',
  validateBody(LoginSchema),
  AuthController.localLogin
);

export default router;