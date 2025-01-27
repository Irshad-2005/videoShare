import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
      addVideoToPlaylist,
      createPlaylist,
      deletePlaylist,
      getPlaylistById,
      getUserPlaylists,
} from "../controllers/playlist.controller.js";

const router = Router();

router.use(auth);

router.route("/").post(createPlaylist);

router.route("/u/:userId").get(getUserPlaylists);

router.route("/p/:playlistId").get(getPlaylistById).delete(deletePlaylist);

router.route("/p/:playlistId/:videoId").post(addVideoToPlaylist);

export default router;
