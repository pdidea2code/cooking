const express = require("express");
const router = express.Router();
const {
  addDiet,
  getDiet,
  updateDiet,
  updateDietStatus,
  deleteDiet,
  deleteMultDiet,
} = require("../../controllers/admin/dietController.js");
const { singleFileUpload } = require("../../helper/imageUpload.js");
const verifyAdminToken = require("../../helper/verifyAdminToken.js");

router.post(
  "/adddiet",
  verifyAdminToken,
  singleFileUpload("public/images/dietimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  addDiet
);
router.get("/getdiet", verifyAdminToken, getDiet);
router.post(
  "/updatediet/:id",
  verifyAdminToken,
  singleFileUpload("public/images/dietimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  updateDiet
);
router.put("/updatedietstatus/:id", verifyAdminToken, updateDietStatus);
router.delete("/deletediet/:id", verifyAdminToken, deleteDiet);
router.delete("/deletemultdiet", verifyAdminToken, deleteMultDiet);

module.exports = router;
