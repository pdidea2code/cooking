const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
var bodyParser = require("body-parser");

require("dotenv").config();
const { connectDB } = require("./config/dbConnection");

connectDB();

app.set("trust proxy", true);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const adminRouter = require("./routes/admin");
const path = require("path");
app.use(adminRouter);

app.use((err, req, res, next) => {
  console.log(err);
  if (err.code && err.code === 11000) {
    // Customize the error message for duplicate key errors
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

app.use("/public/adminprofile", express.static(path.join(__dirname, "./public/images/adminimg")));

const port = process.env.PORT || 5057;
const server = http.createServer(app);
server.listen(port, () => console.log(`http://localhost:${port}`));
