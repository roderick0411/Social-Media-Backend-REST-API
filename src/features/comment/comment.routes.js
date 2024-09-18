import express from "express";
import { auth } from "../../middlewares/jwtAuth.js";
import {
  addComment,
  getPostComments,
  updateComment,
  deleteComment,
} from "./comment.controller.js";

const commentRouter = express.Router();

commentRouter.route("/:postId").post(auth, addComment);
commentRouter.route("/:postId").get(auth, getPostComments);
commentRouter.route("/:commentId").put(auth, updateComment);
commentRouter.route("/:commentId").delete(auth, deleteComment);

export default commentRouter;
