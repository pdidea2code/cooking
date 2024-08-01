const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const {
  addPlan,
  getPlan,
  updatePlan,
  updatePlanStatus,
  deletePlan,
  deleteMultiPlans,
} = require("../../controllers/admin/planController");
const router = express.Router();

router.post("/addplan", verifyAdminToken, addPlan);
router.get("/getplan", verifyAdminToken, getPlan);
router.put("/updateplan/:id", verifyAdminToken, updatePlan);
router.put("/updateplanstatus/:id", verifyAdminToken, updatePlanStatus);
router.delete("/deleteplan/:id", verifyAdminToken, deletePlan);
router.delete("/deletemultiplans", verifyAdminToken, deleteMultiPlans);

module.exports = router;
