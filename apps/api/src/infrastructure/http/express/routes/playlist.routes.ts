import { Router } from "express";
import { PLAYLIST_ROUTES } from "../../routes.constants";
import { PlaylistController } from "../controllers/PlaylistController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();

router.get(PLAYLIST_ROUTES.LIST,
  AuthMiddleware.authenticate,
  PlaylistController.getPlaylists
)

export default router;