const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const {
  addNotification,
  getNotifications,
  updateNotification,
  updateNotificationStatus,
  deleteNotification,
  deleteMultiNotifications,
} = require("../../controllers/admin/notificationController");

const router = express.Router();

router.post("/addnotification", verifyAdminToken, addNotification);
router.get("/getnotifications", verifyAdminToken, getNotifications);
router.put("/updatenotification/:id", verifyAdminToken, updateNotification);
router.put("/updatenotificationstatus/:id", verifyAdminToken, updateNotificationStatus);
router.delete("/deletenotification/:id", verifyAdminToken, deleteNotification);
router.delete("/deletemultinotification", verifyAdminToken, deleteMultiNotifications);

module.exports = router;
