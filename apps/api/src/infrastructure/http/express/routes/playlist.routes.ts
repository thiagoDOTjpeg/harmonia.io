import { Router } from "express";
import { PlaylistController } from "../../../../presentation/controllers/playlist.controller";
import { PLAYLIST_ROUTES } from "../../routes.constants";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();

router.get(PLAYLIST_ROUTES.LIST,
  AuthMiddleware.authenticate,
  PlaylistController.getPlaylists
);

router.get(PLAYLIST_ROUTES.DETAILS,
  AuthMiddleware.authenticate,
  PlaylistController.getPlaylistDetails
);

router.delete(PLAYLIST_ROUTES.DELETE,
  AuthMiddleware.authenticate,
  PlaylistController.deletePlaylist
);

router.get(PLAYLIST_ROUTES.TRACK_CANDIDATES,
  AuthMiddleware.authenticate,
  PlaylistController.getTrackCandidates
);

router.post(PLAYLIST_ROUTES.MATCH_TRACK,
  AuthMiddleware.authenticate,
  PlaylistController.matchTrack
);

export default router;