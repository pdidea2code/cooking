const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const {
  addGeneralSetting,
  updateGeneralSetting,
  getGeneralSetting,
} = require("../../controllers/admin/generalsettingController");
const router = express.Router();

router.post("/addgeneralsetting", verifyAdminToken, addGeneralSetting);
router.put("/updategeneralsetting", verifyAdminToken, updateGeneralSetting);
router.get("/getgeneralsetting", verifyAdminToken, getGeneralSetting);

module.exports = router;
