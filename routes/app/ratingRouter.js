const express = require("express");
const verifyAppToken = require("../../helper/verifyAppToken");
const { singleFileUpload } = require("../../helper/imageUpload");
const { addRating } = require("../../controllers/app/ratingController");
const router = express.Router();

router.post("/addrating", verifyAppToken, addRating);

module.exports = router;
