import mongoose from "mongoose";
import { commentSchema } from "./comment.schema.js";
import { customErrorHandler } from "../../middlewares/errorHandler.js";

const commentModel = mongoose.model("Comment", commentSchema);

export const addNewComment = async (comment) => {
  const newComment = new commentModel(comment);
  return await newComment.save();
};

export const getPostCommentsRepo = async (postId) => {
  const comments = await commentModel.find({ postId });
  return comments;
};

export const updateCommentRepo = async (data) => {
  const commentId = data.commentId;
  const comment = await commentModel.findById(commentId);
  if (!comment) {
    throw new customErrorHandler(404, "Invalid commentId");
  }
  if (!comment.userId.equals(data.userId)) {
    throw new customErrorHandler(
      404,
      "You are not authorized to update another user's comment"
    );
  }
  comment.set(data.updateObj);
  return await comment.save();
};

export const deleteCommentRepo = async (data) => {
  const commentId = data.commentId;
  const comment = await commentModel.findById(commentId);
  if (!comment) {
    throw new customErrorHandler(404, "Invalid commentId");
  }
  if (!comment.userId.equals(data.userId)) {
    throw new customErrorHandler(
      404,
      "You are not authorized to Delete another user's comment"
    );
  }
  return await commentModel.findByIdAndDelete(commentId);
};
