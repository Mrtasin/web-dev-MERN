import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { registerUser } from "./src/controllers/auth.controllers.js";

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

const helth = (req, res) => {
  res.status(200).json({
    message: "Helth Check Successfully",
    success: true,
  });
};



app.get("/", helth);


app.post("/register", registerUser)

app.listen(port, () => {
  console.log("Server is Running on port : ", port);
});
