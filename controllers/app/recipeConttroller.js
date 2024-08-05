const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const Rating = require("../../models/Rating");
const Recipe = require("../../models/Recipe");
const Comment = require("../../models/Comment");
const Ingredient = require("../../models/Ingredient");
const Step = require("../../models/Step");
const Nutrition = require("../../models/Nutrition");
const mongoose = require("mongoose");

const latestRecipe = async (req, res, next) => {
  try {
    const dietObjectIds = req.user.diet.map((id) => new mongoose.Types.ObjectId(id));
    const allergieObjectIds = req.user.allergie.map((id) => new mongoose.Types.ObjectId(id));

    const query = {};

    if (dietObjectIds.length > 0) {
      query.diet = { $in: dietObjectIds };
    }

    if (allergieObjectIds.length > 0) {
      query.allergie = { $nin: allergieObjectIds };
    }

    const recipes = await Recipe.find(query).sort({ createdAt: -1 }); // Sort by latest created
    if (recipes.length === 0) {
      return queryErrorRelatedResponse(req, res, 404, "No Recipes Found");
    }

    const data = recipes.map((data) => {
      return {
        _id: data._id,
        title: data.title,
        image: data.image,
        description: data.description,
        time: data.time,
        isSubscripe: data.isSubscripe,
        averagerating: data.averagerating,
      };
    });
    const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_RECIPE_IAMGE;

    successResponse(res, data, baseUrl);
  } catch (error) {
    next(error);
  }
};

const recipeById = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return queryErrorRelatedResponse(req, res, 404, "Recipe Not Found");
    }

    if (recipe.isSubscripe !== req.user.issubscribe) {
      return queryErrorRelatedResponse(req, res, 400, "Subscripe Now");
    }

    const giveyourate = await Rating.findOne({ userid: req.user._id, recipeid: recipeId });
    const ingredient = await Ingredient.find({ recipeid: recipeId }).populate("unit");

    const ingredients = ingredient.map((data) => {
      return {
        _id: data._id,
        name: data.name,
        amount: data.amount,
        unit: data.unit.name,
      };
    });

    const step = await Step.find({ recipeid: recipeId });
    const nutrition = await Nutrition.find({ recipeid: recipeId });

    const data = {
      _id: recipe._id,
      image: recipe.image,
      time: recipe.time,
      averagerating: recipe.averagerating,
      totalcomment: recipe.totalcomment,
      audio: recipe.audio,
      video: recipe.video,
      yourrate: giveyourate,
      ingredient: ingredients,
      step: step,
      nutrition: nutrition,
    };

    const comment = await Comment.find({ recipeid: recipeId }).populate([
      {
        path: "userid",
        select: ["_id", "name", "image"],
      },
    ]);
    const imagecomment = await Comment.countDocuments({ isimage: true });

    const baseUrl = {
      recipe: req.protocol + "://" + req.get("host") + process.env.BASE_URL_RECIPE_IAMGE,
      step: req.protocol + "://" + req.get("host") + process.env.BASE_URL_STEP_IMAGE,
      comment: req.protocol + "://" + req.get("host") + process.env.BASE_URL_COMMENT_IMAGE,
      user: req.protocol + "://" + req.get("host") + process.env.BASE_URL_USER_PROFILE_PATH,
    };
    const result = {
      recipe: data,
      comment: comment,
      imagecommentcount: imagecomment,
    };
    successResponse(res, result, baseUrl);
  } catch (error) {
    next(error);
  }
};

const recipeFilter = async (req, res, next) => {
  const filters = {};
  if (req.body.meal) {
    filters.meal = req.body.meal.map((id) => new mongoose.Types.ObjectId(id));
  }
  if (req.body.category) {
    filters.category = req.body.category.map((id) => new mongoose.Types.ObjectId(id));
  }
  if (req.body.diet) {
    filters.diet = req.body.diet.map((id) => new mongoose.Types.ObjectId(id));
  }
  if (req.body.cuisine) {
    filters.cuisine = req.body.cuisine.map((id) => new mongoose.Types.ObjectId(id));
  }
  if (req.body.allergy) {
    filters.allergie = req.body.allergy.map((id) => new mongoose.Types.ObjectId(id));
  }
  // console.log(filters);

  try {
    const recipe = await Recipe.find(filters);
    if (recipe.length === 0) {
      return queryErrorRelatedResponse(req, res, 404, "No Recipes Found");
    }

    const data = recipe.map((data) => {
      return {
        _id: data._id,
        title: data.title,
        image: data.image,
        time: data.time,
        isSubscripe: data.isSubscripe,
        averagerating: data.averagerating,
      };
    });
    const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_RECIPE_IAMGE;

    successResponse(res, data, baseUrl);
  } catch (error) {
    next(error);
  }
};

const sercheRecipe = async (req, res, next) => {
  try {
    const { query } = req.body;
    const recipe = await Recipe.find({ title: { $regex: query, $options: "i" } });
    if (!recipe) queryErrorRelatedResponse(req, res, 404, "Recipe Not Found");

    const data = recipe.map((data) => {
      return {
        _id: data._id,
        title: data.title,
        image: data.image,
        description: data.description,
        time: data.time,
        isSubscripe: data.isSubscripe,
        averagerating: data.averagerating,
      };
    });
    const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_RECIPE_IAMGE;
    successResponse(res, data, baseUrl);
  } catch (error) {}
};

const mostPopularRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.find().sort({ averagerating: -1 });
    if (!recipe.length) return queryErrorRelatedResponse(req, res, 404, "Recipe Not Found");

    const data = recipe.map((data) => {
      return {
        _id: data._id,
        title: data.title,
        image: data.image,
        description: data.description,
        time: data.time,
        isSubscripe: data.isSubscripe,
        averagerating: data.averagerating,
      };
    });
    const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_RECIPE_IAMGE;
    successResponse(res, data, baseUrl);
  } catch (error) {
    next(error);
  }
};
module.exports = { latestRecipe, recipeById, recipeFilter, sercheRecipe, mostPopularRecipe };
