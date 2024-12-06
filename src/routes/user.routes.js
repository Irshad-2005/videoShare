import { Router } from "express";
import {
    userRegiter,
    logInUser,
    logOutUser,
    updateRefreshTokenUser,
    changeUserPassword,
    updateUserAccountDetail,
    updateUserAvatar,
    getUserProfile,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory,
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

router.route("/change-password").patch(auth, changeUserPassword);

router.route("/update-profile").patch(auth, updateUserAccountDetail);

router.route("/profile").get(auth, getUserProfile);

router
    .route("/update-avatar")
    .patch(auth, upload.single("avatar"), updateUserAvatar);

router
    .route("/update-coverImage")
    .patch(auth, upload.single("coverImage"), updateUserCoverImage);

router.route("/channel-profile/:username").get(auth, getUserChannelProfile);

router.route("/watch-history").get(auth, getWatchHistory);

export default router;
