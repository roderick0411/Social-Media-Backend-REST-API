import express from "express";
import multer from "multer";
import { auth } from "../../middlewares/jwtAuth.js";
import {
  addPost,
  getPost,
  getUserPosts,
  getAllPosts,
  deletePost,
  updatePost,
} from "./post.controller.js";

const postRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

postRouter.use(upload.single("imageUrl"));
postRouter.route("/").post(auth, addPost);
// postRouter.route("/:postId").get(auth, getPost);
postRouter.route("/all").get(getAllPosts);
postRouter.route("/:postId").get(getPost);
postRouter.route("/").get(auth, getUserPosts);
postRouter.route("/:postId").delete(auth, deletePost);
postRouter.route("/:postId").put(auth, updatePost);

export default postRouter;
