const express = require("express");
const router = express.Router();
const userRouter = require("./userRouter");
const racipeRouter = require("./recipeRouter");
const commentRouter = require("./commentRouter");
const ratingRouter = require("./ratingRouter");

router.use("/user", userRouter);
router.use("/user/racipe", racipeRouter);
router.use("/user/comment", commentRouter);
router.use("/user/rating", ratingRouter);

module.exports = router;
