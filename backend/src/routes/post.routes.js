import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";

const router = Router();
router.use();


router.route("/").get(upload.single('image'), )


export default router;