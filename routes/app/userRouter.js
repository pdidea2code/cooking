const express = require("express");
const {
  signup,
  login,
  addProfile,

  checkEmailId,
  verifyOtp,
  mobaileOtpVerify,
  resetPassword,
  RefreshToken,
  getProfile,
  socialLogin,
} = require("../../controllers/app/userController");
const { singleFileUpload } = require("../../helper/imageUpload");
const verifyAppToken = require("../../helper/verifyAppToken");
const router = express.Router();

router.post(
  "/signup",

  signup
);
router.post("/login", login);
router.post(
  "/addprofile",
  singleFileUpload("public/images/userimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),

  addProfile
);

router.post("/socialLogin", socialLogin);
router.post("/checkemailid", checkEmailId);
router.post("/verifyotp", verifyOtp);
router.post("/mobaileotpverify", mobaileOtpVerify);
router.post("/resetpassword", resetPassword);
router.post("/refreshtoken", RefreshToken);
router.get("/getProfile", verifyAppToken, getProfile);
module.exports = router;
