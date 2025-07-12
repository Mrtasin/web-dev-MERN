import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./src/routes/auth.routes.js";
import db from "./src/utils/db.js";
dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
  })
);
app.use(cookieParser());

db();

const helth = (req, res) => {
  res.status(200).json({
    message: "Helth Check Successfully",
    success: true,
  });
};

app.get("/", helth);

app.use("/api/v1/users", authRoutes);

app.listen(port, () => {
  console.log("Server is Running on port : ", port);
});
