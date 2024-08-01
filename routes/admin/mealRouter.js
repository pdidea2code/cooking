const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const {
  addMeal,
  getMeal,
  updateMeal,
  updateMealStatus,
  deleteMeal,
  deleteMultMeal,
} = require("../../controllers/admin/mealController");
const router = express.Router();

router.post("/addmeal", verifyAdminToken, addMeal);
router.get("/getmeal", verifyAdminToken, getMeal);
router.put("/updatemeal/:id", verifyAdminToken, updateMeal);
router.put("/updatemealstatus/:id", verifyAdminToken, updateMealStatus);
router.delete("/deletemeal/:id", verifyAdminToken, deleteMeal);
router.delete("/deletemultmeal", verifyAdminToken, deleteMultMeal);

module.exports = router;
