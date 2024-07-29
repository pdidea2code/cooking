const express = require("express");
const route = express.Router();
const adminRouter = require("./adminRoutes");

route.use("/admin", adminRouter);

module.exports = route;
