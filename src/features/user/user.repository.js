import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { customErrorHandler } from "../../middlewares/errorHandler.js";
import {
  compareHashedPassword,
  hashPassword,
} from "../../utils/hashPassword.js";

export const UserModel = mongoose.model("User", userSchema);

export const userRegisterationRepo = async (userData) => {
  try {
    const newUser = new UserModel(userData);
    newUser.tokens = [];
    await newUser.save();
    return { success: true, res: newUser };
  } catch (error) {
    // throw new Error("email duplicate");
    return { success: false, error: { statusCode: 400, msg: error } };
  }
};

export const userLoginRepo = async (userData) => {
  try {
    const { email, password } = userData;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return {
        success: false,
        error: { statusCode: 404, msg: "user not found" },
      };
    } else {
      let passwordValidation = await compareHashedPassword(
        password,
        user.password
      );
      if (passwordValidation) {
        return { success: true, res: user };
      } else {
        return {
          success: false,
          error: { statusCode: 400, msg: "invalid credentials" },
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      error: { statusCode: 400, msg: error },
    };
  }
};

export const addToken = async (userData) => {
  try {
    const { id, token } = userData;
    const user = await UserModel.findById(id);
    if (!user) {
      return {
        success: false,
        error: { statusCode: 404, msg: "user not found" },
      };
    } else {
      user.tokens.addToSet(token);
      await user.save();
      return { success: true, res: user };
    }
  } catch (error) {
    return {
      success: false,
      error: { statusCode: 400, msg: error },
    };
  }
};

export const checkToken = async (userData) => {
  try {
    const { id, token } = userData;
    const user = await UserModel.findById(id);
    if (!user) {
      return {
        success: false,
        error: { statusCode: 404, msg: "user not found" },
      };
    } else {
      const tokens = user.tokens;
      console.log("tokens present: ");
      if (tokens.includes(token)) {
        return { token, tokenIncluded: true, user };
      } else {
        return { token, tokenIncluded: false, user };
      }
    }
  } catch (error) {
    return {
      success: false,
      error: { statusCode: 400, msg: error },
    };
  }
};

export const removeToken = async (userData) => {
  try {
    const { id, token } = userData;
    const user = await UserModel.findById(id);
    if (!user) {
      return {
        success: false,
        error: { statusCode: 404, msg: "user not found" },
      };
    } else {
      await user.tokens.pull(token);
      await user.save();
      return { success: true, tokenRemoved: true };
    }
  } catch (error) {
    return {
      success: false,
      error: { statusCode: 400, msg: error },
    };
  }
};

export const removeAllTokens = async (userData) => {
  try {
    const { id } = userData;
    const user = await UserModel.findById(id);
    if (!user) {
      return {
        success: false,
        error: { statusCode: 404, msg: "user not found" },
      };
    } else {
      const updatedUser = await UserModel.updateOne(
        { _id: id },
        { tokens: [] }
      );
      return updatedUser;
    }
  } catch (error) {
    return {
      success: false,
      error: { statusCode: 400, msg: error },
    };
  }
};

export const updateUserPasswordRepo = async (_id, newpassword, next) => {
  try {
    const user = await UserModel.findOne({ _id });
    if (!user) {
      return {
        success: false,
        error: { statusCode: 404, msg: "user not found" },
      };
    } else {
      const newHashedPassword = await hashPassword(newpassword, next);
      user.password = newHashedPassword;
      let updatedUser = await user.save();
      return { success: true, res: updatedUser };
    }
  } catch (error) {
    return {
      success: false,
      error: { statusCode: 400, msg: error },
    };
  }
};

export const getUserDetailsRepo = async (userData) => {
  try {
    const { id } = userData;
    const user = await UserModel.findById(id);
    if (!user) {
      return {
        success: false,
        error: { statusCode: 404, msg: "user not found" },
      };
    } else {
      const { name, email, gender } = user;
      return { name, email, gender };
    }
  } catch (error) {
    return {
      success: false,
      error: { statusCode: 400, msg: error },
    };
  }
};

export const getAllUserDetailsRepo = async () => {
  try {
    const users = await UserModel.find();
    const details = [];
    for (const user of users) {
      const { _id, name, email, gender } = user;
      details.push({ _id, name, email, gender });
    }
    return details;
  } catch (error) {
    return {
      success: false,
      error: { statusCode: 400, msg: error },
    };
  }
};

export const updateUserDetailsRepo = async (_id, details, next) => {
  try {
    const user = await UserModel.findOne({ _id });
    if (!user) {
      return {
        success: false,
        error: { statusCode: 404, msg: "user not found" },
      };
    } else {
      let updatedUser = user;
      const { name, email, password, gender } = details;
      if (name) {
        user.name = name;
        updatedUser = await user.save();
      }
      if (email) {
        user.email = email;
        updatedUser = await user.save();
      }
      if (gender) {
        user.gender = gender;
        updatedUser = await user.save();
      }
      if (password) {
        const newHashedPassword = await hashPassword(password, next);
        user.password = newHashedPassword;
        updatedUser = await user.save();
      }
      return { success: true, res: updatedUser };
    }
  } catch (error) {
    return {
      success: false,
      error: { statusCode: 400, msg: error },
    };
  }
};
