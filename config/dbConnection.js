const mongoose = require("mongoose");
//Date Base Connection
const connectDB = async () => {
  await mongoose
    .connect(process.env.DB_URL)
    .then((res) => {
      console.log("Database connection sucessfully !");
    })
    .catch((error) => {
      console.log("Database connection error", error);
    });
};

module.exports = { connectDB };
