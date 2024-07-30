const express = require("express");
const route = express.Router();
const adminRouter = require("./adminRoutes");
const dietRouter = require("./dietRoutes");
const alletgieRouter = require("./allergieRoutes");
const userRouter = require("./userRoutes");
const categoryRouter = require("./categorRoutes");
const cuisineRouter = require("./cuisineRoutes");
const mealRouter = require("./mealRoutes");

// Use router in index
route.use("/admin", adminRouter);
route.use("/admin/diet", dietRouter);
route.use("/admin/allergie", alletgieRouter);
route.use("/admin/user", userRouter);
route.use("/admin/category", categoryRouter);
route.use("/admin/cuisine", cuisineRouter);
route.use("/admin/meal", mealRouter);

module.exports = route;
