const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const { getUser } = require("../../controllers/admin/userController");
const router = express.Router();

router.get("/getuser", verifyAdminToken, getUser);
module.exports = router;
