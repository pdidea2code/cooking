const { successResponse } = require("../../helper/sendResponse");
const Category = require("../../models/Category");
const Cuisine = require("../../models/Cuisine");
const Diet = require("../../models/Diet");
const Meal = require("../../models/Meal");
const Recipe = require("../../models/Recipe");
const User = require("../../models/User");

const dashboardCount = async (req, res, next) => {
  try {
    const recipe = await Recipe.countDocuments();
    const user = await User.countDocuments();
    const category = await Category.countDocuments();
    const diet = await Diet.countDocuments();
    const cuisine = await Cuisine.countDocuments();
    const meal = await Meal.countDocuments();
    const subscribedUser = await User.countDocuments({ issubscribe: true });
    const data = {
      recipe,
      user,
      category,
      diet,
      cuisine,
      meal,
      subscribedUser,
    };
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const topRecipe = async (req, res, next) => {
  try {
    const recipes = await Recipe.find().sort({ averagerating: -1 }).limit(5);

    const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_RECIPE_IAMGE;
    const data = {
      recipes: recipes,
      baseUrl: baseUrl,
    };
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const resentRecipe = async (req, res, next) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 }).limit(5);

    const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_RECIPE_IAMGE;
    const data = {
      recipes: recipes,
      baseUrl: baseUrl,
    };
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const activeDeactiveUser = async (req, res, nest) => {
  try {
    const active = await User.countDocuments({ status: true });
    const deactive = await User.countDocuments({ status: false });

    const data = {
      activeUser: active,
      deactiveUser: deactive,
    };
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

module.exports = { topRecipe, dashboardCount, resentRecipe, activeDeactiveUser };
