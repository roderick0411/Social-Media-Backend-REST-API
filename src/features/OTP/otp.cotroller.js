import {
  newOtpRepo,
  deleteOtpRepo,
  verifyOtpRepo,
  updateUserPasswordRepo,
} from "./otp.repository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { customErrorHandler } from "../../middlewares/errorHandler.js";

export const sendOTP = async (req, res, next) => {
  const userId = req._id;
  try {
    const resp = await newOtpRepo(userId);
    if (resp) {
      res.status(201).json({
        success: true,
        msg: resp,
      });
    } else {
      res.status(400).json({ success: false, msg: "bad request" });
    }
  } catch (error) {
    next(new customErrorHandler(400, error));
  }
};

export const verifyOTP = async (req, res, next) => {
  const userId = req._id;
  const { otpCode } = req.body;
  console.log({ userId, otpCode });
  try {
    const resp = await verifyOtpRepo({ userId, otpCode });
    if (resp) {
      res.status(201).json({
        success: true,
        msg: resp,
      });
    } else {
      res.status(400).json({ success: false, msg: "bad request" });
    }
  } catch (error) {
    next(new customErrorHandler(400, error));
  }
};

export const resetPassword = async (req, res, next) => {
  const userId = req._id;
  const { password } = req.body;
  console.log({ userId, password });
  try {
    const resp = await updateUserPasswordRepo(
      { userId, newPassword: password },
      next
    );
    if (resp) {
      res.status(201).json({
        success: true,
        msg: resp,
      });
    } else {
      res.status(400).json({ success: false, msg: "bad request" });
    }
  } catch (error) {
    next(new customErrorHandler(400, error.message));
  }
};
