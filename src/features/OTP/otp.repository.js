import mongoose from "mongoose";
import nodemailer from "nodemailer";

import { otpSchema } from "./otp.schema.js";
import { UserModel } from "../user/user.repository.js";
import { hashPassword } from "../../utils/hashPassword.js";

export const otpModel = mongoose.model("OTP", otpSchema);

function generateOTP(limit) {
  // Declare a digits variable
  // which stores all digits
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < limit; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

export const newOtpRepo = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return {
        success: false,
        error: { statusCode: 404, msg: "user not found" },
      };
    }
    const { name, email } = user;
    const password = generateOTP(4);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "codingninjas2k16@gmail.com",
        pass: "slwvvlczduktvhdj",
      },
    });
    const mailOptions = {
      from: "codingninjas2k16@gmail.com",
      to: email,
      subject: "Password Change OTP",
      text: "OTP: " + password,
    };

    console.log("User: ");
    console.log(user);
    console.log(`email: ${email}`);

    const info = await transporter
      .sendMail(mailOptions)
      .then((info) => {
        console.log(info);
        return info;
      })
      .catch((err) => {
        throw new Error("Error ocurred in sending OTP");
      });
    if (info) {
      // Purge previous OTPs
      await otpModel.deleteMany({ userId });
      const newOtp = new otpModel({ userId, name, email, password });
      await newOtp.save();
    }
    return {
      success: true,
      res: "Success: OTP sent messageId: " + info.messageId,
      envelope: info.envelope,
    };
  } catch (error) {
    return { success: false, error: { statusCode: 400, msg: error } };
  }
};

export const deleteOtpRepo = async (id) => {
  try {
    const deletedOtp = await otpModel.findByIdAndDelete(id);
    return { success: true, res: deletedOtp };
  } catch (error) {
    return { success: false, error: { statusCode: 400, msg: error } };
  }
};

export const verifyOtpRepo = async ({ userId, otpCode }) => {
  console.log({ userId, otpCode });
  try {
    const otp = await otpModel.findOne({ userId });
    console.log(otp);
    if (!otp) {
      return {
        success: false,
        error: { statusCode: 404, msg: "otp not found" },
      };
    }
    const codeSent = otp.password;
    const codeReceived = otpCode;
    const timeSent = new Date(otp.createdAt);
    const timeReceived = new Date();
    const timeElapsed = (timeReceived - timeSent) / 60000;
    console.log({
      codeSent,
      codeReceived,
      timeSent,
      timeReceived,
      timeElapsed,
    });
    if (codeSent != codeReceived) {
      throw new Error("OTP doesn't match, please try again");
    }
    if (timeElapsed >= 5) {
      throw new Error("Time limit(5 minutes) exceeded");
    }
    if (codeSent === codeReceived && timeElapsed < 5) {
      otp.verifiedAt = new Date();
      await otp.save();
      return { success: true };
    }
    throw new Error("Error ocurred, please try again");
  } catch (error) {
    return { success: false, error: { statusCode: 400, msg: error.message } };
  }
};

export const updateUserPasswordRepo = async ({ userId, newPassword }, next) => {
  try {
    const otp = await otpModel.findOne({ userId });
    console.log(otp);
    if (!otp) {
      return {
        success: false,
        error: { statusCode: 404, msg: "otp not found" },
      };
    }
    if (!otp.verifiedAt) {
      return {
        success: false,
        error: {
          statusCode: 404,
          msg: "Please generate and verify the OTP first",
        },
      };
    }
    const timeNow = new Date();
    if ((timeNow - otp.verifiedAt) / 60000 > 2) {
      throw new Error(
        "Time exceeded, must reset password within 2 minutes after OTP verification"
      );
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    } else {
      const newHashedPassword = await hashPassword(newPassword, next);
      user.password = newHashedPassword;
      let updatedUser = await user.save();
      // Delete the OTP document
      await otpModel.deleteMany({ userId });
      return { success: true, res: updatedUser };
    }
  } catch (error) {
    return {
      success: false,
      error: { statusCode: 400, msg: error.message },
    };
  }
};
