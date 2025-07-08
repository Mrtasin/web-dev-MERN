import { registerUser } from "../controllers/auth.controllers.js";
import { Router } from "express";

const routes = Router();

routes.post("/register", registerUser);

export default routes;
