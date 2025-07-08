import mongoose from "mongoose";

const db = () => {
  mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(() => {
      console.log("DataBase Connected");
    })
    .catch((err) => {
      console.log("DataBase not Connected :-", err);
    });
};


export default db