import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";

import userRouter from "./src/features/user/user.routes.js";
import postRouter from "./src/features/posts/post.routes.js";
import commentRouter from "./src/features/comment/comment.routes.js";
import likesRouter from "./src/features/like/like.routes.js";
import friendshipRouter from "./src/features/friendship/friendship.routes.js";
import otpRouter from "./src/features/OTP/otp.routes.js";

import { appLevelErrorHandlerMiddleware } from "./src/middlewares/errorHandler.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/likes", likesRouter);
app.use("/api/friends", friendshipRouter);
app.use("/api/otp", otpRouter);

app.use(appLevelErrorHandlerMiddleware);

export default app;
