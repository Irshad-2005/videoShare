import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
      createTweet,
      deleteTweet,
      updateTweet,
} from "../controllers/tweet.controller.js";

const router = Router();

router.use(auth);

router.route("/tweet").post(createTweet);
router.route("/tweet/:tweetId").put(updateTweet).delete(deleteTweet);

export default router;
