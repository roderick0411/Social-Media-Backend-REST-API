import express from "express";
import {
  updateUserPassword,
  userLogin,
  userLogout,
  userLogoutAllDevices,
  userRegisteration,
  getUserDetails,
  getAllUserDetails,
  updateUserDetails,
} from "./user.cotroller.js";
import { auth } from "../../middlewares/jwtAuth.js";

const router = express.Router();

router.route("/signup").post(userRegisteration);
router.route("/signin").post(userLogin);
router.route("/logout").get(userLogout);
router.route("/logout-all-devices").get(userLogoutAllDevices);
router.route("/get-details/:userId").get(getUserDetails);
router.route("/get-all-details/").get(getAllUserDetails);
router.route("/update-details/:userId").put(updateUserDetails);
router.route("/update/password").put(auth, updateUserPassword);
// router.route("/auth").post(auth);

export default router;
