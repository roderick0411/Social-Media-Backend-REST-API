import mongoose from "mongoose";
import { friendshipSchema } from "./friendship.schema.js";
import { UserModel } from "../user/user.repository.js";
const friendshipModel = mongoose.model("Friendship", friendshipSchema);

export const toggleFriendshipRepo = async ({ sender, receiver }) => {
  const friendship = await friendshipModel.findOne({ sender, receiver });
  if (friendship) {
    return await friendshipModel.findByIdAndDelete(friendship._id);
  }
  const senderUser = await UserModel.findById(sender);
  if (!senderUser) {
    throw new customErrorHandler(404, "Invalid PostId");
  }
  const receiverUser = await UserModel.findById(receiver);
  if (!receiverUser) {
    throw new customErrorHandler(404, "Invalid PostId");
  }
  const newRequest = new friendshipModel({
    sender,
    receiver,
  });
  return await newRequest.save();
};

export const friendshipResponseRepo = async ({
  sender,
  receiver,
  response,
}) => {
  console.log({
    sender,
    receiver,
    response,
  });
  const friendship = await friendshipModel.findOne({ sender, receiver });
  console.log(friendship);
  if (!friendship) {
    throw new customErrorHandler(400, "Request doesn't exist");
  }
  friendship.status = response;
  return await friendship.save();
};

export const getPendingRequestsRepo = async ({ receiver }) => {
  const pendingRequests = await friendshipModel.find({
    receiver,
    status: "Pending",
  });
  console.log(pendingRequests);
  return pendingRequests;
};

export const getFriendsRepo = async ({ userId }) => {
  const friends = [];
  const sentRequests = await friendshipModel.find({
    sender: userId,
    status: "Accepted",
  });
  for (const request of sentRequests) {
    const { receiver } = request;
    const receiverUser = await UserModel.findById(receiver);
    const { _id, name, email } = receiverUser;
    friends.push({ _id, name, email });
  }
  const receivedRequests = await friendshipModel.find({
    receiver: userId,
    status: "Accepted",
  });
  for (const request of receivedRequests) {
    const { sender } = request;
    const senderUser = await UserModel.findById(sender);
    const { _id, name, email } = senderUser;
    friends.push({ _id, name, email });
  }
  console.log(friends);
  return friends;
};
