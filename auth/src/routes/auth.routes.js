import { isVerify, registerUser } from "../controllers/auth.controllers.js";
import { Router } from "express";

const routes = Router();

routes.post("/register", registerUser);
routes.post("/verify/:token", isVerify);

export default routes;
