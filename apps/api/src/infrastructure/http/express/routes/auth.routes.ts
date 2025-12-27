import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

const router = Router();

router.post("/auth/request-reset", AuthController.requestReset)

router.post("/auth/reset-password", AuthController.resetPassword)

router.post("/auth/set-password", AuthMiddleware.authenticate, AuthController.setPassword)

router.get("/auth/:provider", AuthController.startOAuthFlow)

router.get("/auth/:provider/callback", AuthController.handleOAuthCallback)

router.post(
  '/auth/register',
  AuthController.localRegister
);

router.post(
  '/auth/login',
  AuthController.localLogin
);

router.post("/auth/request-access", AuthController.requestAccess);

export default router;