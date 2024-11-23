import { Router } from "express";
import {
    userRegiter,
    logInUser,
    logOutUser,
    updateRefreshTokenUser,
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

router.route("/refresh-token").post(updateRefreshTokenUser);

export default router;
