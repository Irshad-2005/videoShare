import { Router } from "express";
import {
    userRegiter,
    logInUser,
    logOutUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    userRegiter
);

router.route("/login").post(logInUser);

router.route("/logout").post(auth, logOutUser);

export default router;
