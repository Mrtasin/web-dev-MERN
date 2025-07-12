import {
  forgotPassword,
  getProfile,
  isVerify,
  loginUser,
  registerUser,
  resetPassword,
  userLogout,
} from "../controllers/auth.controllers.js";

import { Router } from "express";
import isLoggedIn from "../middleware/user.middleware.js";

const routes = Router();

routes.post("/register", registerUser);
routes.post("/verify/:token", isVerify);
routes.post("/login", loginUser);
routes.get("/profile", isLoggedIn, getProfile);
routes.get("/logout", isLoggedIn, userLogout);
routes.post("/forgot-password", forgotPassword);
routes.post("/reset-password/:token", resetPassword);

export default routes;
