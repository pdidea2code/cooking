const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const {
  addUnit,
  getUnit,
  updateUnit,
  updateUnitStatus,
  deleteUnit,
  deleteMultUnit,
} = require("../../controllers/admin/ingredientUnitController");
const router = express.Router();

router.post("/addunit", verifyAdminToken, addUnit);
router.get("/getunit", verifyAdminToken, getUnit);
router.put("/updateunit/:id", verifyAdminToken, updateUnit);
router.put("/updateunitstatus/:id", verifyAdminToken, updateUnitStatus);
router.delete("/deleteunit/:id", verifyAdminToken, deleteUnit);
router.delete("/deletemultunit", verifyAdminToken, deleteMultUnit);

module.exports = router;
