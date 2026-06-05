import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import reelRouter from "./routes/reel.routes.js";
import storyRouter from "./routes/stroy.routes.js";
import messageRouter from "./routes/message.routes.js";
import { app, server } from "./socket.js";

dotenv.config()
const port = process.env.PORT || 5000

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/post",postRouter )
app.use("/api/reel",reelRouter)
app.use("/api/story",storyRouter)
app.use("/api/message",messageRouter)
app.get("/", (req, res) => {
    res.send("heeloo")
})

server.listen(port, () => {
    connectDb()
    console.log("server started", port);
})

