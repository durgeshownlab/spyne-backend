import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteComment, getCommentForComment, getCommentForPost, postCommentOnComment, postCommentOnPost, updateComment } from "../controllers/comment.controllers.js";

const router = Router();

router.use(verifyJWT);

router.route("/post/:postId").get(getCommentForPost);
router.route("/:commentId").get(getCommentForComment);
router.route("/post/:postId").post(postCommentOnPost);
router.route("/:commentId").post(postCommentOnComment);
router.route("/:commentId").patch(updateComment);
router.route("/:commentId").delete(deleteComment);


export default router;