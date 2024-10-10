const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const { getUser, deleteUser } = require("../../controllers/admin/userController");
const router = express.Router();

router.get("/getuser", verifyAdminToken, getUser);
router.post("/deleteUser", verifyAdminToken, deleteUser);

module.exports = router;
