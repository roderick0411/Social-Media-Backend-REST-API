import { customErrorHandler } from "../../middlewares/errorHandler.js";
import {
  addNewComment,
  getPostCommentsRepo,
  updateCommentRepo,
  deleteCommentRepo,
} from "./comment.repository.js";

export const addComment = async (req, res, next) => {
  const userId = req._id;
  const { postId } = req.params;
  const { content } = req.body;
  try {
    const resp = await addNewComment({ userId, postId, content });
    if (resp) {
      res.status(201).json({
        success: true,
        msg: "comment added successfully with ",
        post_description: resp,
      });
    } else {
      res.status(400).json({ success: false, msg: "bad request" });
    }
  } catch (error) {
    next(new customErrorHandler(400, error));
  }
};

export const getPostComments = async (req, res, next) => {
  const { postId } = req.params;
  console.log(`postId: ${postId}`);
  try {
    const resp = await getPostCommentsRepo(postId);
    if (resp) {
      res.status(201).json({
        success: true,
        msg: "comments fetched successfully ",
        post: resp,
      });
    } else {
      res.status(400).json({ success: false, msg: "bad request" });
    }
  } catch (error) {
    next(new customErrorHandler(400, error));
  }
};

export const updateComment = async (req, res, next) => {
  const userId = req._id;
  const { commentId } = req.params;
  const updateObj = {};
  const { content } = req.body;
  if (content) {
    updateObj.content = content;
  }
  console.log(userId);
  console.log(commentId);
  console.log(content);
  console.log("**********************************************");
  try {
    const resp = await updateCommentRepo({ userId, commentId, updateObj });
    if (resp) {
      res.status(201).json({
        success: true,
        msg: "comment updated successfully ",
        comment_description: resp,
      });
    } else {
      res.status(400).json({ success: false, msg: "bad request" });
    }
  } catch (error) {
    next(new customErrorHandler(400, error));
  }
};

export const deleteComment = async (req, res, next) => {
  const userId = req._id;
  const { commentId } = req.params;
  console.log(userId);
  console.log(commentId);
  try {
    const resp = await deleteCommentRepo({ userId, commentId });
    if (resp) {
      res.status(201).json({
        success: true,
        msg: "comment deleted successfully ",
        comment_description: resp,
      });
    } else {
      res.status(400).json({ success: false, msg: "bad request" });
    }
  } catch (error) {
    next(new customErrorHandler(400, error));
  }
};
