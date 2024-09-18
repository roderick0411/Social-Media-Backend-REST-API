import { customErrorHandler } from "../../middlewares/errorHandler.js";
import { getLikesRepo, toggleLikeRepo } from "./like.repository.js";

export const toggleLike = async (req, res, next) => {
  const userId = req._id;
  const { postId } = req.params;
  try {
    const resp = await toggleLikeRepo({ userId, postId });
    if (resp) {
      res.status(201).json({
        success: true,
        msg: `liked toggled successfully`,
        resp,
      });
    }
  } catch (error) {
    next(new customErrorHandler(400, error));
  }
};

export const getLikes = async (req, res, next) => {
  const { postId } = req.params;
  console.log(postId);
  try {
    const resp = await getLikesRepo(postId);
    if (resp) {
      res.status(200).json({ success: true, likesCount: resp.likesCount });
    }
  } catch (error) {
    next(new customErrorHandler(400, error));
  }
};
