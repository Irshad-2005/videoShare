import { Router } from "express";
import { userRegiter } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(userRegiter);

export default router;
