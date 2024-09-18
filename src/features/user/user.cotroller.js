import {
  updateUserPasswordRepo,
  userLoginRepo,
  userRegisterationRepo,
  addToken,
  removeToken,
  removeAllTokens,
  getUserDetailsRepo,
  getAllUserDetailsRepo,
  updateUserDetailsRepo,
} from "./user.repository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { customErrorHandler } from "../../middlewares/errorHandler.js";

export const userRegisteration = async (req, res, next) => {
  let { password } = req.body;
  password = await bcrypt.hash(password, 12);
  const resp = await userRegisterationRepo({ ...req.body, password });
  if (resp.success) {
    res.status(201).json({
      success: true,
      msg: "user registration successful",
      res: resp.res,
    });
  } else {
    next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
  }
};
export const userLogin = async (req, res, next) => {
  // if jwt token already exists, remove it from DB before going further
  const loggedIn = checkLogin(req);
  if (loggedIn.login) {
    const removeTokenTask = await removeToken({
      id: loggedIn.data._id,
      token: loggedIn.token,
    });
    console.log(removeTokenTask);
  }
  const resp = await userLoginRepo(req.body);
  if (resp.success) {
    const { _id, name, email, password, gender } = resp.res;
    const respObj = { _id, name, email, password, gender };
    const token = jwt.sign({ _id: resp.res._id, user: respObj }, "secret", {
      expiresIn: "1h",
    });
    await addToken({ id: resp.res._id, token });
    res
      .cookie("jwtToken", token, { maxAge: 1 * 60 * 60 * 1000, httpOnly: true })
      .json({ success: true, msg: "user login successful", token });
  } else {
    next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
  }
};
export const updateUserPassword = async (req, res, next) => {
  const { newPassword } = req.body;
  const resp = await updateUserPasswordRepo(req._id, newPassword, next);
  if (resp.success) {
    res.status(201).json({
      success: true,
      msg: "password updated successfully",
      res: resp.res,
    });
  } else {
    next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
  }
};

export const checkLogin = (req) => {
  console.log("Inside checkLogin");
  const { jwtToken } = req.cookies;
  console.log("jwtToken: ");
  console.log(jwtToken);
  if (!jwtToken) {
    return { login: false };
  }
  const res = jwt.verify(jwtToken, "secret", (err, data) => {
    if (err) {
      console.log("Error: ");
      console.log(err);
      return { login: false };
    } else {
      console.log("Data: ");
      console.log(data);
      const res = { login: true, data, token: jwtToken };
      console.log("returning: ");
      return res;
    }
  });
  return res;
};

export const userLogout = async (req, res, next) => {
  // if jwt token already exists, remove it from DB before going further
  const loggedIn = checkLogin(req);
  if (loggedIn.login) {
    const removeTokenTask = await removeToken({
      id: loggedIn.data._id,
      token: loggedIn.token,
    });
    console.log(removeTokenTask);
  }
  res.clearCookie("jwtToken").json({ success: true, msg: "logout successful" });
};

export const userLogoutAllDevices = async (req, res, next) => {
  // if jwt token already exists, remove it from DB before going further
  const loggedIn = checkLogin(req);
  if (loggedIn.login) {
    const removeTokensTask = await removeAllTokens({
      id: loggedIn.data._id,
    });
    console.log(removeTokensTask);
  }

  res.clearCookie("jwtToken").json({ success: true, msg: "logout successful" });
};

export const getUserDetails = async (req, res, next) => {
  // if jwt token already exists, remove it from DB before going further
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ success: false, msg: "Invalid userID" });
  }
  const details = await getUserDetailsRepo({ id: userId });
  res.status(200).json({ success: true, details });
};

export const getAllUserDetails = async (req, res, next) => {
  // if jwt token already exists, remove it from DB before going further
  const details = await getAllUserDetailsRepo();
  res.status(200).json({ success: true, details });
};

export const updateUserDetails = async (req, res, next) => {
  const { userId } = req.params;
  const { name, email, gender } = req.body;
  const resp = await updateUserDetailsRepo(
    userId,
    { name, email, gender },
    next
  );
  if (resp.success) {
    res.status(201).json({
      success: true,
      msg: "details updated successfully",
      res: resp.res,
    });
  } else {
    next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
  }
};
