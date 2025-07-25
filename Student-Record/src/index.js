import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./utils/connectDB.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log("Server running on port :-", port);
    });
  })
  .catch((err) => console.error("MongoDB not connected error :-", err));
