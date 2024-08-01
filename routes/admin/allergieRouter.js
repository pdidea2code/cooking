const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const {
  addAllergie,
  getAllergie,
  updateAllergie,
  updateAllergieStatus,
  deleteAllergie,
  deleteMultAllergie,
} = require("../../controllers/admin/allergieController");
const router = express.Router();

router.post("/addallergie", verifyAdminToken, addAllergie);
router.get("/getallergie", verifyAdminToken, getAllergie);
router.put("/updateallergie/:id", verifyAdminToken, updateAllergie);
router.put("/updateallergiestatus/:id", verifyAdminToken, updateAllergieStatus);
router.delete("/deleteallergie/:id", verifyAdminToken, deleteAllergie);
router.delete("/deletemultallergie", verifyAdminToken, deleteMultAllergie);

module.exports = router;
