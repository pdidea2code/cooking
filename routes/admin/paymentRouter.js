const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const { getPayment } = require("../../controllers/admin/paymentController");
const router = express.Router();

router.get("/getPayment", verifyAdminToken, getPayment);

module.exports = router;
