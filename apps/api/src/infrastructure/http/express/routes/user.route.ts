import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();

router.get("/user/dashboard", AuthMiddleware.authenticate, UserController.getUserSummary);
router.get("/user/connections", AuthMiddleware.authenticate, UserController.getUserConnections);
router.delete("/user/connection/:id", AuthMiddleware.authenticate, UserController.deleteServiceConnectionRevoke);

export default router;