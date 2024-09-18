import mongoose from "mongoose";
import { customErrorHandler } from "../../middlewares/errorHandler.js";
import {
  addNewPost,
  getPostRepo,
  getUserPostsRepo,
  getAllPostsRepo,
  deletePostRepo,
  updatePostRepo,
} from "./post.repository.js";

export const addPost = async (req, res, next) => {
  console.log("**************Inside addPost*****************");
  const userId = req._id;
  const file = req.file;
  // const fileName = file.originalname;
  const contentType = file.mimetype;
  const { caption } = req.body;
  // const data = file.buffer;
  const imgBase64 = file.buffer.toString("base64");
  const imageUrl = `data:${contentType};base64, ${imgBase64}`;
  console.log(userId);
  console.log(caption);
  const imageFile = { contentType, imageUrl };
  console.log(imageFile);
  console.log("**********************************************");
  try {
    const resp = await addNewPost({ userId, caption, imageFile });
    if (resp) {
      res.status(201).json({
        success: true,
        msg: "post added successfully with ",
        post_description: resp,
      });
    } else {
      res.status(400).json({ success: false, msg: "bad request" });
    }
  } catch (error) {
    next(new customErrorHandler(400, error));
  }
};

export const getPost = async (req, res, next) => {
  console.log("**************Inside getPost*****************");
  const { postId } = req.params;
  console.log(`postId: ${postId}`);
  console.log("**********************************************");
  try {
    const resp = await getPostRepo(postId);
    if (resp) {
      res.status(201).json({
        success: true,
        msg: "post fetched successfully ",
        post: resp,
      });
    } else {
      res.status(400).json({ success: false, msg: "bad request" });
    }
  } catch (error) {
    next(new customErrorHandler(400, error));
  }
};

export const getUserPosts = async (req, res, next) => {
  const userId = req._id;
  console.log(`userId: ${userId}`);
  try {
    const resp = await getUserPostsRepo(userId);
    if (resp) {
      console.log(resp);
      res.status(201).json({
        success: true,
        msg: "posts fetched successfully ",
        post: resp,
      });
    } else {
      res.status(400).json({ success: false, msg: "bad request" });
    }
  } catch (error) {
    next(new customErrorHandler(400, error));
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const resp = await getAllPostsRepo();
    if (resp) {
      console.log(resp);
      res.status(201).json({
        success: true,
        msg: "posts fetched successfully ",
        post: resp,
      });
    } else {
      res.status(400).json({ success: false, msg: "bad request" });
    }
  } catch (error) {
    next(new customErrorHandler(400, error));
  }
};

export const deletePost = async (req, res, next) => {
  const { postId } = req.params;
  const userId = req._id;
  try {
    const resp = await deletePostRepo({ postId, userId });
    if (resp.deletedId) {
      res.status(204).json({
        success: true,
        msg: "post deleted successfully ",
      });
    } else if (resp.unauthorized) {
      res.status(400).json({
        success: false,
        msg: "You are not authorized to delete another user's post",
      });
    } else {
      res.status(400).json({ success: false, msg: "bad request" });
    }
  } catch (error) {
    next(new customErrorHandler(400, error));
  }
};

export const updatePost = async (req, res, next) => {
  console.log("**************Inside updatePost*****************");
  const userId = req._id;
  const { postId } = req.params;
  const updateObj = {};
  let imageFile;
  if (req.file) {
    const file = req.file;
    // const fileName = file.originalname;
    // const data = file.buffer;
    const contentType = file.mimetype;
    const imgBase64 = file.buffer.toString("base64");
    const imageUrl = `data:${contentType};base64, ${imgBase64}`;
    imageFile = { contentType, imageUrl };
  }
  if (imageFile) {
    updateObj.imageFile = imageFile;
  }
  const { caption } = req.body;
  if (caption) {
    updateObj.caption = caption;
  }
  console.log(userId);
  console.log(caption);
  console.log(imageFile);
  console.log("**********************************************");
  try {
    const resp = await updatePostRepo({ userId, postId, updateObj });
    if (resp) {
      res.status(201).json({
        success: true,
        msg: "post updated successfully with ",
        post_description: resp,
      });
    } else {
      res.status(400).json({ success: false, msg: "bad request" });
    }
  } catch (error) {
    next(new customErrorHandler(400, error));
  }
};
