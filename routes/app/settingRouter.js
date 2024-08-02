const express = require("express");
const verifyAppToken = require("../../helper/verifyAppToken");
const {
  editProfile,
  updateNotifiStatus,
  updateSubscribeStatus,
  generalSetting,
  getNotification,
  deleteAccount,
} = require("../../controllers/app/settingController");
const { singleFileUpload } = require("../../helper/imageUpload");
const router = express.Router();

router.post(
  "/editprofile",
  singleFileUpload("public/images/userimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  verifyAppToken,
  editProfile
);
router.put("/updatenotifistatus", verifyAppToken, updateNotifiStatus);
router.put("/updatesubscribestatus", verifyAppToken, updateSubscribeStatus);
router.get("/generalsetting", verifyAppToken, generalSetting);
router.get("/getnotification", verifyAppToken, getNotification);
router.delete("/deleteaccount", verifyAppToken, deleteAccount);
module.exports = router;
