const express = require("express");
const {
  Register,
  Login,
  RefreshToken,
  changePassword,
  updateProfile,
} = require("../../controllers/admin/adminController");
const { singleFileUpload } = require("../../helper/imageUpload");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const router = express.Router();

router.post(
  "/register",
  singleFileUpload("public/images/adminimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  Register
);
router.post("/login", Login);
router.post("/refreshtoken", RefreshToken);
router.post("/changepassword", verifyAdminToken, changePassword);
router.post(
  "/updateprofile",
  verifyAdminToken,
  singleFileUpload("public/images/adminimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  updateProfile
);

module.exports = router;
