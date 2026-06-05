import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { addComment, getAllPosts, likeUnlikePost, saveUnsavePost, uploadPost } from "../controllers/post.controllers.js";

const postRouter = express.Router();

postRouter.post("/upload", isAuth, upload.single("media"), uploadPost);
postRouter.get("/getAll", isAuth, getAllPosts);
postRouter.get("/like/:postId", isAuth, likeUnlikePost);
postRouter.put("/saved/:postId", isAuth, saveUnsavePost);
postRouter.post("/comment/:postId", isAuth, addComment);

export default postRouter;