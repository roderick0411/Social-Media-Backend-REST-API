import mongoose from "mongoose";

export const friendshipSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Accepted", "Rejected", "Pending"],
    required: true,
  },
});
