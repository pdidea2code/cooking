const express = require("express");
const route = express.Router();
const adminRouter = require("./adminRoutes");
const dietRouter = require("./dietRoutes");
const alletgieRouter = require("./allergieRoutes");

// Use router in index
route.use("/admin", adminRouter);
route.use("/admin/diet", dietRouter);
route.use("/admin/allergie", alletgieRouter);

module.exports = route;
