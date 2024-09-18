import express from "express";
import { getLikes, toggleLike } from "./like.controller.js";
import { auth } from "../../middlewares/jwtAuth.js";
const likesRouter = express.Router();

likesRouter.route("/:postId").post(auth, toggleLike);
likesRouter.route("/:postId").get(auth, getLikes);

export default likesRouter;
