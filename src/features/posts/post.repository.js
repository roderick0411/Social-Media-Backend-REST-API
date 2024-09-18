import mongoose from "mongoose";
import { postSchema } from "./post.schema.js";
import { customErrorHandler } from "../../middlewares/errorHandler.js";

export const postModel = mongoose.model("Post", postSchema);

export const addNewPost = async (post) => {
  const newPost = new postModel(post);
  return await newPost.save();
};

export const getPostRepo = async (postId) => {
  const post = await postModel.findById(postId);
  if (!post) {
    throw new customErrorHandler(404, "Invalid PostId");
  }
  return post;
  // const { _id, userId, caption } = post;
  // const imgBase64 = post.imageFile.data;
  // const { contentType, imageUrl } = post.imageFile;
  // console.log(post.imageFile.data.data.toString("base64"));
  // return { _id, userId, caption, contentType, imageUrl };
};

export const getUserPostsRepo = async (userId) => {
  const posts = await postModel.find({ userId });
  return posts;
};

export const getAllPostsRepo = async () => {
  const posts = await postModel.find();
  return posts;
};

export const deletePostRepo = async (ids) => {
  const post = await postModel.findById(ids.postId);
  if (!post) {
    throw new customErrorHandler(404, "Invalid PostId");
  }
  console.log(`postId: ${post._id}`);
  console.log(`post's userId: ${post.userId}`);
  console.log(`userId: ${ids.userId}`);
  if (!post.userId.equals(ids.userId)) {
    return { success: false, unauthorized: true };
  }
  if (post.userId.equals(ids.userId)) {
    console.log("Match");
    const deleted = await postModel.findByIdAndDelete(ids.postId);
    return { success: true, deletedId: deleted._id };
  }
  return { success: false, deletedId: null };
};

export const updatePostRepo = async (data) => {
  const postId = data.postId;
  const post = await postModel.findById(postId);
  if (!post) {
    throw new customErrorHandler(404, "Invalid PostId");
  }
  if (!post.userId.equals(data.userId)) {
    throw new customErrorHandler(
      404,
      "You are not authorized to update another user's post"
    );
  }
  post.set(data.updateObj);
  return await post.save();
};
