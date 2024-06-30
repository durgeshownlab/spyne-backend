import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleFollow } from "../controllers/follow.controllers.js";

const router = Router();

router.use(verifyJWT);

router.route("/:userName").post(toggleFollow)

export default router;