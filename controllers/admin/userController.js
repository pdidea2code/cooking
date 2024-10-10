const { queryErrorRelatedResponse, successResponse } = require("../../helper/sendResponse");
const User = require("../../models/User");
const Comment = require("../../models/Comment");
const Recipe = require("../../models/Recipe");
const mongoose = require("mongoose");
const Shopinglist = require("../../models/Shopinglist");

//Get All User
const getUser = async (req, res, next) => {
  try {
    const user = await User.find().populate(["diet", "allergie"]);
    if (!user) return queryErrorRelatedResponse(req, res, 404, "User Not Found");

    const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_USER_PROFILE_PATH;
    const data = {
      user: user,
      baseUrl: baseUrl,
    };
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.id);
    if (!user) {
      return queryErrorRelatedResponse(req, res, 401, "User Not Found");
    }

    const comments = await Comment.find({ userid: req.body.id });

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

    await Shopinglist.deleteMany({ userid: req.body.id });
    deleteFiles("userimg/" + user.image);
    await User.deleteOne({ _id: req.body.id });

    successResponse(res, "Account deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUser,
  deleteUser,
};
