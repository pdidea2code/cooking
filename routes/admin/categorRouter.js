const express = require("express");
const router = express.Router();
const {
  addCategory,
  getCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
  deleteMultCategory,
} = require("../../controllers/admin/categoryController.js");
const { singleFileUpload } = require("../../helper/imageUpload.js");
const verifyAdminToken = require("../../helper/verifyAdminToken.js");

router.post(
  "/addcategory",
  verifyAdminToken,
  singleFileUpload("public/images/categoryimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  addCategory
);
router.get("/getcategory", verifyAdminToken, getCategory);
router.put(
  "/updatecategory/:id",
  verifyAdminToken,
  singleFileUpload("public/images/categoryimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  updateCategory
);
router.put("/updatecategorystatus/:id", verifyAdminToken, updateCategoryStatus);
router.delete("/deletecategory/:id", verifyAdminToken, deleteCategory);
router.delete("/deletemultcategory", verifyAdminToken, deleteMultCategory);

module.exports = router;
