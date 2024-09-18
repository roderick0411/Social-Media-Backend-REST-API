import jwt from "jsonwebtoken";
import { checkToken } from "../features/user/user.repository.js";

export const auth = async (req, res, next) => {
  const { jwtToken } = req.cookies;
  if (!jwtToken) {
    return res.status(400).send("unauthorized! login to continue!");
  }
  jwt.verify(jwtToken, "secret", async (err, data) => {
    if (err) {
      res.status(400).send("unauthorized! login to continue!");
    } else {
      console.log("*******************");
      console.log("data:", data);
      console.log("*******************");
      const checkLogin = await checkToken({ id: data._id, token: jwtToken });
      console.log("checkLogin: ");
      console.log(checkLogin);
      if (!checkLogin.tokenIncluded) {
        return res.status(400).send("unauthorized! login to continue!");
      }
      console.log("*******************");
      req._id = data._id;
      req.user = data.user;
      next();
    }
  });
};
