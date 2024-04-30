import mongoose from "mongoose";

export const connectMongoDb = async () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGO_URI)
    .then((response) => {
      console.log("mongoDB Connected");
    })
    .catch((e) => {
      console.log("Error occured" + e);
    });
};
