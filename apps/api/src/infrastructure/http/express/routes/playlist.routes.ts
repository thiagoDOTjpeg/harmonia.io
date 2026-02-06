import { Router } from "express";
import { PlaylistController } from "../../../../presentation/controllers/playlist.controller";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();

router.get("/playlists",
  AuthMiddleware.authenticate,
  PlaylistController.getPlaylists
)

export default router;