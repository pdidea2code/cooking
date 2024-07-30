const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const {
  addCuisine,
  getCuisine,
  updateCuisine,
  updateCuisineStatus,
  deleteCuisine,
  deleteMultCuisine,
} = require("../../controllers/admin/cuisineController");
const router = express.Router();

router.post("/addcuisine", verifyAdminToken, addCuisine);
router.get("/getcuisine", verifyAdminToken, getCuisine);
router.put("/updatecuisine/:id", verifyAdminToken, updateCuisine);
router.put("/updatecuisinestatus/:id", verifyAdminToken, updateCuisineStatus);
router.delete("/deletecuisine/:id", verifyAdminToken, deleteCuisine);
router.delete("/deletemultcuisine", verifyAdminToken, deleteMultCuisine);

module.exports = router;
