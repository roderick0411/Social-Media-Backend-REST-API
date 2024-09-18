import { customErrorHandler } from "../../middlewares/errorHandler.js";
import {
  toggleFriendshipRepo,
  friendshipResponseRepo,
  getPendingRequestsRepo,
  getFriendsRepo,
} from "./friendship.repository.js";

export const toggleFriendship = async (req, res, next) => {
  const sender = req._id;
  const { friendId } = req.params;
  try {
    const resp = await toggleFriendshipRepo({ sender, receiver: friendId });
    if (resp) {
      res.status(201).json({
        success: true,
        msg: "request toggled successfully with ",
        post_description: resp,
      });
    } else {
      res.status(400).json({ success: false, msg: "bad request" });
    }
  } catch (error) {
    next(new customErrorHandler(400, error));
  }
};

export const friendshipResponse = async (req, res, next) => {
  const receiver = req._id;
  console.log(`receiver: ${receiver}`);
  const { friendId } = req.params;
  console.log(`friendId: ${friendId}`);
  const { response } = req.query;
  console.log(`response: ${response}`);
  try {
    const resp = await friendshipResponseRepo({
      sender: friendId,
      receiver,
      response,
    });
    if (resp) {
      res.status(201).json({
        success: true,
        msg: "responded successfully ",
        description: resp,
      });
    } else {
      res.status(400).json({ success: false, msg: "bad request" });
    }
  } catch (error) {
    next(new customErrorHandler(400, error));
  }
};

export const getPendingRequests = async (req, res, next) => {
  const receiver = req._id;
  try {
    const resp = await getPendingRequestsRepo(receiver);
    if (resp) {
      res.status(201).json({
        success: true,
        msg: "fetched successfully ",
        description: resp,
      });
    } else {
      res.status(400).json({ success: false, msg: "bad request" });
    }
  } catch (error) {
    next(new customErrorHandler(400, error));
  }
};

export const getFriends = async (req, res, next) => {
  const userId = req.params;
  try {
    const resp = await getFriendsRepo(userId);
    if (resp) {
      res.status(201).json({
        success: true,
        msg: "Friends fetched successfully ",
        description: resp,
      });
    } else {
      res.status(400).json({ success: false, msg: "bad request" });
    }
  } catch (error) {
    next(new customErrorHandler(400, error));
  }
};
