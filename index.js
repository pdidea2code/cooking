const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
var bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const { connectDB } = require("./config/dbConnection");
const mongoose = require("mongoose");

//Date Base Connectionn
// connectDB();
mongoose
  .connect(process.env.DB_URL)
  .then((res) => {
    console.log("Database connection sucessfully !");
  })
  .catch((error) => {
    console.log("Database connection error", error);
  });

// Trust proxy headers
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const currentTime = new Date().toISOString();
  console.log(`[${currentTime}] ${req.method} ${req.url} - IP: ${req.ip}`);

  next();
});

//Admin Route
const adminRouter = require("./routes/admin");
app.use(adminRouter);

//User Route
const userRouter = require("./routes/app");
app.use(userRouter);

app.use((err, req, res, next) => {
  console.log(err);
  if (err.code && err.code === 11000) {
    err.message = `Duplicate key error: ${Object.keys(err.keyValue)[0]} with value ${
      Object.values(err.keyValue)[0]
    } already exists.`;
  }
  res.status(422).json({
    status: 422,
    success: false,
    message: err.message,
  });
});

// Define static files
app.use("/public/adminprofile", express.static(path.join(__dirname, "./public/images/adminimg")));
app.use("/public/dietimage", express.static(path.join(__dirname, "./public/images/dietimg")));
app.use("/public/userprofile", express.static(path.join(__dirname, "./public/images/userimg")));
app.use("/public/categoryimage", express.static(path.join(__dirname, "./public/images/categoryimg")));
app.use("/public/recipeimage", express.static(path.join(__dirname, "./public/images/recipeimg")));
app.use("/public/stepimage", express.static(path.join(__dirname, "./public/images/stepimg")));
app.use("/public/commentimage", express.static(path.join(__dirname, "./public/images/commentimg")));

app.use(express.static(path.join(__dirname, "./client/build")));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build", "index.html"));
});
//App Run

const port = process.env.PORT || 5057;
const server = http.createServer(app);
server.listen(port, () => console.log(`http://localhost:${port}`));
