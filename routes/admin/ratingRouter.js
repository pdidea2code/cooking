const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const { getRating } = require("../../controllers/admin/ratingController");
const router = express.Router();

router.get("/getrating", verifyAdminToken, getRating);

module.exports = router;
