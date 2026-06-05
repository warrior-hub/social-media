import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  getAllMessages,
  getPevUserChats,
  getUnreadMessageCount,
  markMessagesAsSeen,
  sendMessage,
} from "../controllers/message.controllers.js";
import { upload } from "../middlewares/multer.js";

const messageRouter = express.Router();

messageRouter.get("/getAll/:receiverId", isAuth, getAllMessages);
messageRouter.post("/send/:receiverId", isAuth,upload.single("image"), sendMessage);
messageRouter.get("/prevChats/", isAuth, getPevUserChats);
messageRouter.put("/seen/:receiverId",isAuth, markMessagesAsSeen);
messageRouter.get("/unread-count",isAuth, getUnreadMessageCount);

export default messageRouter;