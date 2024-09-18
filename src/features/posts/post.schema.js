import mongoose from "mongoose";

export const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  caption: {
    type: String,
    required: [true, "name is required"],
    minLength: [3, "The name should be at least 3 characters long"],
  },
  imageFile: {
    // fileName: { type: String, required: true },
    imageUrl: { type: String, required: true },
    contentType: { type: String, required: true },
    // data: { type: Buffer, required: true },
    // data: { type: String, required: true },
  },
});
