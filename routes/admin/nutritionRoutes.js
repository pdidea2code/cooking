const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const {
  addNutrition,
  getNutrition,
  getRecipeWiseNutrition,
  updateNutrition,
  deleteNutrition,
  deleteMultNutrition,
} = require("../../controllers/admin/nutritionController");
const router = express.Router();

router.post("/addnutrition", verifyAdminToken, addNutrition);
router.get("/getnutrition", verifyAdminToken, getNutrition);
router.get("/getrecipewisenutrition/:id", verifyAdminToken, getRecipeWiseNutrition);
router.put("/updatenutrition/:id", verifyAdminToken, updateNutrition);
router.delete("/deletenutrition/:id", verifyAdminToken, deleteNutrition);
router.delete("/deletemultnutrition", verifyAdminToken, deleteMultNutrition);

module.exports = router;
