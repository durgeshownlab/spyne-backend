import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createPost, deletePost, getAllPost, getPostBasedOnText, getPostByHashtag, updatePost } from "../controllers/post.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);


router.route("/").post(upload.single('image'), createPost);
router.route("/").get(getAllPost);
router.route("/:postId").patch(updatePost);
router.route("/:postId").delete(deletePost);
router.route("/search/:searchText").get(getPostBasedOnText);
router.route("/search/tag/:hashtag").get(getPostByHashtag);


export default router;