const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const {
  addIngredient,
  getIngredient,
  getRecipeWiseIngredient,
  updateIngredient,
  deleteIngredient,
  deleteMultIngredient,
} = require("../../controllers/admin/ingredientController");
const router = express.Router();

router.post("/addingredient", verifyAdminToken, addIngredient);
router.get("/getingredient", verifyAdminToken, getIngredient);
router.get("/getrecipewiseingredient/:id", verifyAdminToken, getRecipeWiseIngredient);
router.put("/updateingredient/:id", verifyAdminToken, updateIngredient);
router.delete("/deleteingredient/:id", verifyAdminToken, deleteIngredient);
router.delete("/deletemultingredient", verifyAdminToken, deleteMultIngredient);

module.exports = router;
