import express from "express";
import { auth } from "../../middlewares/jwtAuth.js";

import { sendOTP, verifyOTP, resetPassword } from "./otp.cotroller.js";

const otpRouter = express.Router();

otpRouter.route("/send").post(auth, sendOTP);
otpRouter.route("/verify").post(auth, verifyOTP);
otpRouter.route("/reset-password").post(auth, resetPassword);

export default otpRouter;
