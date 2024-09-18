import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { UserModel } from "../user/user.repository.js";
import { postModel } from "../posts/post.repository.js";
const likeModel = mongoose.model("Like", likeSchema);

export const toggleLikeRepo = async ({ userId, postId }) => {
  const like = await likeModel.findOne({ userId, postId });
  if (like) {
    console.log("Like: ");
    console.log(like);
    console.log("Deleting like.....");
    console.log("************");
    return likeModel.findByIdAndDelete(like._id);
  }
  const user = await UserModel.findById(userId);
  const { name, email } = user;
  const newLike = new likeModel({
    userId,
    postId,
    userName: name,
    userEmail: email,
  });
  return await newLike.save();
};

export const getLikesRepo = async (postId) => {
  const post = await postModel.findById(postId);
  console.log(post);
  if (!post) {
    throw new customErrorHandler(404, "Invalid PostId");
  }
  const likes = await likeModel.find({ postId });
  console.log("Likes: ");
  console.log(likes);
  return { likesCount: likes.length };
};
