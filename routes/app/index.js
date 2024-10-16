const express = require("express");
const router = express.Router();
const userRouter = require("./userRouter");
const recipeRouter = require("./recipeRouter");
const commentRouter = require("./commentRouter");
const ratingRouter = require("./ratingRouter");
const settingRouter = require("./settingRouter");
const generalRoter = require("./generalRouter");
const planRouter = require("./planRouter");
const shopingListRouter = require("./shopinglistRouter");

router.use("/user", userRouter);
router.use("/user/recipe", recipeRouter);
router.use("/user/comment", commentRouter);
router.use("/user/rating", ratingRouter);
router.use("/user/setting", settingRouter);
router.use("/user/general", generalRoter);
router.use("/user/plan", planRouter);
router.use("/user/shopinglist", shopingListRouter);

module.exports = router;
