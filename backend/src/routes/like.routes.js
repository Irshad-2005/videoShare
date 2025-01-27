import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
      toggleCommentLike,
      toggleTweetLike,
      toggleVideoLike,
} from "../controllers/like.controller.js";

const router = Router();

router.use(auth);

router.route("/v/:videoId").post(toggleVideoLike);
router.route("/c/:commentId").post(toggleCommentLike);
router.route("/t/:tweetId").post(toggleTweetLike);

export default router;
