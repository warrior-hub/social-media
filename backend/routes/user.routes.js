import express from "express"
import isAuth from "../middlewares/isAuth.js";
import { editProfile, followUnfollow, getAllNotifications, getCurrentUser, getProfile, markAllAsRead, search, suggestedUsers } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.js";
const userRouter =express.Router()

userRouter.get("/current",isAuth,getCurrentUser)
userRouter.get("/suggested",isAuth,suggestedUsers)
userRouter.post("/editprofile",isAuth,upload.single("profileImage"),editProfile)
userRouter.get("/getProfile/:userName",isAuth,getProfile)
userRouter.get("/follow/:id", isAuth, followUnfollow);
userRouter.get("/search",isAuth,search)
userRouter.get("/getAllNotifications",isAuth,getAllNotifications)
userRouter.put("/markAllAsRead", isAuth, markAllAsRead);

export default userRouter;