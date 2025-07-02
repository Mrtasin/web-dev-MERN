import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const port = process.env.PORT || 8000;

const app = express();

app.use(
  cors({
    origin: process.env.BASE_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.get("/", (req, res) => {
  res.send("This is a Home Page");
});

app.post("/data/:email", (req, res) => {
  console.log(req.body, req.params.email);
  res.status(200).json({
    message: "Ok",
  });
});

app.listen(port, () => {
  console.log("Server is Running on port : ", port);
});
