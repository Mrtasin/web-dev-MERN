import express from "express";
import dotenv from "dotenv";
dotenv.config("./.env");

const app = express();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Testing Application");
});

app.post("/home", (req, res) => {
  res.send("Testing Application");
});

app.listen(port, () => {
  console.log("Server is Running on Port : ", port);
});
