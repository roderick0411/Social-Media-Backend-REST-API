import mongoose from "mongoose";

export const otpSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: {
      type: String,
      required: [true, "name is required"],
      minLength: [3, "The name should be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      match: [/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/],
    },
    password: { type: String, required: true },
    verifiedAt: Date,
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: false,
    },
  }
);
