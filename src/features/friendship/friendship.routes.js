import express from "express";
import { auth } from "../../middlewares/jwtAuth.js";
import {
  toggleFriendship,
  friendshipResponse,
  getPendingRequests,
  getFriends,
} from "./friendship.controller.js";

export const friendshipRouter = express.Router();

friendshipRouter
  .route("/toggle-friendship/:friendId")
  .post(auth, toggleFriendship);

friendshipRouter
  .route("/response-to-request/:friendId")
  .post(auth, friendshipResponse);

friendshipRouter.route("/get-pending-requests").get(auth, getPendingRequests);

friendshipRouter.route("/get-friends/:userId").get(auth, getFriends);

export default friendshipRouter;
