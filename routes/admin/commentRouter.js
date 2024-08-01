const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const { getComment } = require("../../controllers/admin/commentController");
const router = express.Router();

router.get("/getcomment", verifyAdminToken, getComment);

module.exports = router;
