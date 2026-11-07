import { Router } from "express";
import { PlaylistController } from "../../../../presentation/controllers/playlist.controller";
import { PLAYLIST_ROUTES } from "../../routes.constants";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();

router.get(PLAYLIST_ROUTES.LIST,
  AuthMiddleware.authenticate,
  PlaylistController.getPlaylists
)

export default router;