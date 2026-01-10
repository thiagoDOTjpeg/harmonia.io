import { Router } from 'express';
import { AUTH_ROUTES } from '../../routes.constants';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

const router = Router();

router.post(AUTH_ROUTES.REQUEST_RESET, AuthController.requestReset)

router.post(AUTH_ROUTES.RESET_PASSWORD, AuthController.resetPassword)

router.post(AUTH_ROUTES.SET_PASSWORD, AuthMiddleware.authenticate, AuthController.setPassword)

router.get(AUTH_ROUTES.OAUTH_START, AuthController.startOAuthFlow)

router.get(AUTH_ROUTES.OAUTH_CALLBACK, AuthController.handleOAuthCallback)

router.post(
  AUTH_ROUTES.REGISTER,
  AuthController.localRegister
);

router.post(
  AUTH_ROUTES.LOGIN,
  AuthController.localLogin
);

router.post(AUTH_ROUTES.REQUEST_ACCESS, AuthController.requestAccess);

export default router;