import { Router } from "express";
import { deleteUser, getListOfUsers, getUserByName, loginUser, logoutUser, registerUser, updateUser } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/update-account").patch(verifyJWT, updateUser);
router.route("/delete-account").delete(verifyJWT, deleteUser);
router.route("/get-all-users").get(verifyJWT, getListOfUsers);
router.route("/search/:name").get(verifyJWT, getUserByName);

export default router;