const express = require("express");
const route = express.Router();
const adminRouter = require("./adminRoutes");
const dietRouter = require("./dietRoutes");
const alletgieRouter = require("./allergieRoutes");
const userRouter = require("./userRoutes");
const categoryRouter = require("./categorRoutes");
const cuisineRouter = require("./cuisineRoutes");
const mealRouter = require("./mealRoutes");
const recipeRouter = require("./recipeRoutes");
const ingredientUnitRouter = require("./ingredientunitRoutes");
const stepRouter = require("./stepRoutes");
const ingredientRouter = require("./ingredientRoutes");
const nutritionRouter = require("./nutritionRoutes");
const notificationRouter = require("./notificationRoutes");

// Use router in index
route.use("/admin", adminRouter);
route.use("/admin/diet", dietRouter);
route.use("/admin/allergie", alletgieRouter);
route.use("/admin/user", userRouter);
route.use("/admin/category", categoryRouter);
route.use("/admin/cuisine", cuisineRouter);
route.use("/admin/meal", mealRouter);
route.use("/admin/recipe", recipeRouter);
route.use("/admin/ingredientunit", ingredientUnitRouter);
route.use("/admin/step", stepRouter);
route.use("/admin/ingredient", ingredientRouter);
route.use("/admin/nutrition", nutritionRouter);
route.use("/admin/notification", notificationRouter);

module.exports = route;
