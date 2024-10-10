const deleteFiles = require("../../helper/deleteFiles");
const { queryErrorRelatedResponse, successResponse } = require("../../helper/sendResponse");
const User = require("../../models/User");
const GeneralSetting = require("../../models/GeneralSetting");
const Notification = require("../../models/Notification");
const Comment = require("../../models/Comment");
const mongoose = require("mongoose");
const Recipe = require("../../models/Recipe");
const Shopinglist = require("../../models/Shopinglist");

//Edit Profile
const editProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return queryErrorRelatedResponse(req, res, 401, "Invalid User!");

    req.body.name ? (user.name = req.body.name) : user.name;
    if (req.body.diet) {
      const { diet } = req.body;
      user.diet = diet;
    }
    if (req.body.allergie) {
      const { allergie } = req.body;
      user.allergie = allergie;
    }
    console.log(req.file);
    if (req.file && req.file.filename) {
      deleteFiles("userimg/" + user.image);
      user.image = req.file.filename;
    }

    await user.save();
    successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

//Update Notification Status
const updateNotifiStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return queryErrorRelatedResponse(req, res, 404, "Invalid User");

    user.notification = !user.notification;
    await user.save();
    successResponse(res, "Update Successfully");
  } catch (error) {
    next(error);
  }
};

//Update Subsctibe
const updateSubscribeStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return queryErrorRelatedResponse(req, res, 404, "Invalid User");

    user.issubscribe = !user.issubscribe;
    await user.save();
    successResponse(res, "Subscribe Update Successfully");
  } catch (error) {
    next(error);
  }
};

//Get General Setting
const generalSetting = async (req, res, next) => {
  try {
    const setting = await GeneralSetting.findOne();
    if (!setting) return queryErrorRelatedResponse(req, res, 404, "Not Found");

    const data = {
      _id: setting._id,
      termsandcondition: setting.termsandcondition,
      privacypolicy: setting.privacypolicy,
    };

    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

//Get All Notification
const getNotification = async (req, res, next) => {
  try {
    const notification = await Notification.find();
    if (!notification) return queryErrorRelatedResponse(req, res, 404, "Notification not found");

    successResponse(res, notification);
  } catch (error) {
    next(error);
  }
};

//Delete User Account
const deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return queryErrorRelatedResponse(req, res, 401, "User Not Found");
    }

    const comments = await Comment.find({ userid: req.user._id });

    const recipeIdsSet = new Set();

    await Promise.all(
      comments.map(async (comment) => {
        recipeIdsSet.add(comment.recipeid.toString());
        if (comment.image) {
          await deleteFiles("commentimg/" + comment.image);
        }
        await Comment.deleteOne({ _id: comment._id });
      })
    );

    const uniqueRecipeIds = Array.from(recipeIdsSet).map((id) => new mongoose.Types.ObjectId(id));

    await Promise.all(
      uniqueRecipeIds.map(async (data) => {
        const recipe = await Recipe.findById(data);
        if (!recipe) return queryErrorRelatedResponse(req, res, 400, "Something went Wrong");

        const commentCount = await Comment.countDocuments({ recipeid: data });
        recipe.totalcomment = commentCount;
        await recipe.save();
      })
    );

    await Shopinglist.deleteMany({ userid: req.user._id });
    deleteFiles("userimg/" + user.image);
    await User.deleteOne({ _id: req.user._id });

    successResponse(res, "Account deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  editProfile,
  updateNotifiStatus,
  updateSubscribeStatus,
  generalSetting,
  getNotification,
  deleteAccount,
};
