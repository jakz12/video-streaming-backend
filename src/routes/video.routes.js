import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { publishAVideo, getAllVideos, getVideoById, deleteVideo } from "../controllers/video.controllers.js";
const router = Router();

router.route("/upload-video").post(verifyJWT, upload.fields([
    {
        name: "videoFile",
        maxCount: 1,
    },
    {
        name: "thumbnail",
        maxCount: 1,
    }   
]), publishAVideo);

router.route("/getAllVideos").get(getAllVideos);

router.route("/getVideoById").post(getVideoById);

router.route("/deleteVideo/:videoId").delete(verifyJWT,deleteVideo);

export default router; 