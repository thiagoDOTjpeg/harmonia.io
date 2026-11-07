import { Router } from "express";
import { UserController } from "../../../../presentation/controllers/user.controller";
import { USER_ROUTES } from "../../routes.constants";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();

router.get(USER_ROUTES.DASHBOARD, AuthMiddleware.authenticate, UserController.getUserSummary);
router.get(USER_ROUTES.CONNECTIONS, AuthMiddleware.authenticate, UserController.getUserConnections);
router.delete(USER_ROUTES.CONNECTION_REVOKE, AuthMiddleware.authenticate, UserController.deleteServiceConnectionRevoke);

export default router;