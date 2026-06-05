import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { addCommentReel, getAllReels, likeUnlikeReel, uploadReel } from "../controllers/reel.controllers.js";

const reelRouter = express.Router();

reelRouter.post("/upload", isAuth, upload.single("media"), uploadReel);
reelRouter.get("/getAll", isAuth, getAllReels);
reelRouter.get("/like/:reelId", isAuth, likeUnlikeReel);
reelRouter.post("/comment/:reelId",isAuth,addCommentReel)

export default reelRouter;