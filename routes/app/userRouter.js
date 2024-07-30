const express = require("express");
const {
  signup,
  login,
  addProfile,
  editProfile,
  updateNotifiStatus,
  updateSubscribeStatus,
  checkEmailId,
  verifyOtp,
  mobaileOtpVerify,
  resetPassword,
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
router.post(
  "/editprofile",
  singleFileUpload("public/images/userimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  verifyAppToken,
  editProfile
);
router.post("/updatenotifistatus", verifyAppToken, updateNotifiStatus);
router.post("/updatesubscribestatus", verifyAppToken, updateSubscribeStatus);
router.post("/checkemailid", checkEmailId);
router.post("/verifyotp", verifyOtp);
router.post("/mobaileotpverify", mobaileOtpVerify);
router.post("/resetpassword", resetPassword);
module.exports = router;
