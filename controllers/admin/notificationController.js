const { queryErrorRelatedResponse, createResponse, successResponse } = require("../../helper/sendResponse");
const Notification = require("../../models/Notification");

// const firebaseadmin = require("firebase-admin");
// const serviceAccount = require("../../../config/glamspot-firebase.json");

// firebaseadmin.initializeApp({
//   credential: firebaseadmin.credential.cert(serviceAccount),
// });

// Add a new notification
const addNotification = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const notification = await Notification.create({ title, description });
    if (!notification) return queryErrorRelatedResponse(req, res, 404, "Notification Not Created");

    // await firebaseadmin.messaging().send(message);

    successResponse(res, notification);
  } catch (error) {
    next(error);
  }
};

// Get all notifications
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find();
    if (!notifications) return queryErrorRelatedResponse(req, res, 404, "No Notifications Found");

    successResponse(res, notifications);
  } catch (error) {
    next(error);
  }
};

// Update notification
const updateNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const notification = await Notification.findById(id);
    if (!notification) return queryErrorRelatedResponse(req, res, 404, "Notification Not Found");

    if (title) notification.title = title;
    if (description) notification.description = description;
    await notification.save();
    successResponse(res, notification);
  } catch (error) {
    next(error);
  }
};

// Update notification status
const updateNotificationStatus = async (req, res, next) => {
  // Assuming there's a status field; if not, you can remove this
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) return queryErrorRelatedResponse(req, res, 404, "Notification Not Found");

    notification.status = !notification.status; // Or whatever logic you need
    await notification.save();
    successResponse(res, notification);
  } catch (error) {
    next(error);
  }
};

// Delete  notification
const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Notification.deleteOne({ _id: id });
    if (result.deletedCount === 0) return queryErrorRelatedResponse(req, res, 404, "Notification Not Found");

    successResponse(res, "Notification Deleted Successfully");
  } catch (error) {
    next(error);
  }
};

// Delete multiple notifications
const deleteMultiNotifications = async (req, res, next) => {
  try {
    console.log("call");
    console.log(req.body);
    const { ids } = req.body;
    const result = await Notification.deleteMany({ _id: { $in: ids } });

    successResponse(res, "Notifications Deleted Successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addNotification,
  getNotifications,
  updateNotification,
  updateNotificationStatus,
  deleteNotification,
  deleteMultiNotifications,
};
