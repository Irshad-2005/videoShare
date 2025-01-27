import {
    addComment,
    deleteComment,
    updateComment,
} from "../controllers/comment.controller.js";
import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
const router = Router();

router.use(auth);

router.route("/:videoId").post(addComment);

router.route("/:commentId").patch(updateComment);

router.route("/c/:commentId").delete(deleteComment);

export default router;
