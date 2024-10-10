const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const Rating = require("../../models/Rating");
const Recipe = require("../../models/Recipe");
const Comment = require("../../models/Comment");
const Ingredient = require("../../models/Ingredient");
const Step = require("../../models/Step");
const Nutrition = require("../../models/Nutrition");
const mongoose = require("mongoose");
const Recentview = require("../../models/Recentview");
const Shopinglist = require("../../models/Shopinglist");
const User = require("../../models/User");
const Plandetail = require("../../models/Plandetail");

//Get Latest Recipe
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
    // if (recipes.length === 0) {
    //   return queryErrorRelatedResponse(req, res, 404, "No Recipes Found");
    // }
    if (!recipes) {
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

//Get Recipe Detail
const recipeById = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return queryErrorRelatedResponse(req, res, 404, "User Not Found");

    const plandetail = await Plandetail.findOne({ userid: req.user._id }).sort({ createdAt: -1 });

    if (plandetail && plandetail.planexpire < Date.now()) {
      user.issubscribe = false;
      await user.save();
    }
    if (plandetail && plandetail.planexpire > Date.now()) {
      user.issubscribe = true;
      await user.save();
    }

    const recipeId = req.params.id;

    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return queryErrorRelatedResponse(req, res, 404, "Recipe Not Found");
    }

    if (recipe.isSubscripe) {
      if (!user.issubscribe) {
        return queryErrorRelatedResponse(req, res, 400, "Subscripe Now");
      }
    }

    const giveyourate = await Rating.findOne({ userid: req.user._id, recipeid: recipeId });
    const ingredient = await Ingredient.find({ recipeid: recipeId }).populate("unit");

    const ingredients = ingredient.map((data) => {
      return {
        _id: data._id,
        name: data.name,
        amount: data.amount,
        unit: data.unit?.name,
      };
    });

    const step = await Step.find({ recipeid: recipeId });
    const nutrition = await Nutrition.find({ recipeid: recipeId });

    const yourrating = await Rating.findOne({ userid: req.user._id, recipeid: req.params.id });
    const shopinglist = await Shopinglist.findOne({ userid: req.user._id, recipeid: req.params.id });
    const data = {
      _id: recipe._id,
      videotype: recipe.videotype,
      image: recipe.image,
      time: recipe.time,
      title: recipe.title,
      averagerating: recipe.averagerating,
      totalcomment: recipe.totalcomment,
      audio: recipe.audio,
      video: recipe.video,
      videourl: recipe.videourl,
      shopinglist: shopinglist ? true : false,
      yourrating: yourrating?.rating,
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

    const findrecentview = await Recentview.findOne({ recipeid: recipeId, userid: req.user.id });

    if (!findrecentview) {
      const recentview = await Recentview.create({
        recipeid: recipeId,
        userid: req.user.id,
      });
    } else {
      const deletes = await Recentview.deleteOne({ _id: findrecentview._id });

      const recentview = await Recentview.create({
        recipeid: recipeId,
        userid: req.user.id,
      });
    }

    const result = {
      recipe: data,
      comment: comment,
      commentcount: comment.length,
      imagecommentcount: imagecomment,
    };

    successResponse(res, result, baseUrl);
  } catch (error) {
    next(error);
  }
};

//Filter Recipe By Meal,Category,Diet,Cuisine And Allergy
const recipeFilter = async (req, res, next) => {
  console.log(req.body);
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
    // if (recipe.length === 0) {
    //   return queryErrorRelatedResponse(req, res, 404, "No Recipes Found");
    // }

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

//Serche Recipe
const sercheRecipe = async (req, res, next) => {
  try {
    const { query } = req.body;
    const recipe = await Recipe.find({ title: { $regex: query, $options: "i" } });
    if (!recipe) queryErrorRelatedResponse(req, res, 404, "Recipe Not Found");
    recipe.push(recipe);
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

//Most Poular Recipe sort by Rating
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

const recentViewRecipe = async (req, res, next) => {
  try {
    const recentview = await Recentview.find({ userid: req.user._id });
    if (!recentview) return queryErrorRelatedResponse(res, res, 404, "Recent Recipe not found ");

    const recipe = await Promise.all(
      recentview.map(async (data) => {
        const recipe = await Recipe.findById(data.recipeid);
        if (!recipe) return 0;
        return recipe;
      })
    );

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

const addShopingist = async (req, res, next) => {
  try {
    const shopinglist = await Shopinglist.create({
      userid: req.user._id,
      recipeid: req.body.id,
      person: req.body.person,
    });

    successResponse(res, "Recipe add shoping list successfully");
  } catch (error) {
    next(error);
  }
};

const shopingList = async (req, res, next) => {
  try {
    const shopingList = await Shopinglist.find({ userid: req.user._id });

    const data = await Promise.all(
      shopingList.map(async (data) => {
        const recipe = await Recipe.findById(data.recipeid);
        const ingredient = await Ingredient.find({ recipeid: recipe._id }).populate("unit");

        const ingredients = ingredient.map((data) => {
          return {
            _id: data._id,
            name: data.name,
            amount: data.amount,
            unit: data.unit?.name,
          };
        });
        return {
          _id: data._id,
          recipe_id: recipe._id,
          image: recipe.image,
          title: recipe.title,
          person: data.person,
          ingredient: ingredients,
        };
      })
    );
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const deleteShopinglist = async (req, res, next) => {
  try {
    const shopinglist = await Shopinglist.findById(req.params.id);
    if (!shopinglist) return queryErrorRelatedResponse(req, res, 404, "Not Found");

    await Shopinglist.deleteOne({ _id: req.params.id });
    successResponse(res, "Delete Successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  latestRecipe,
  recipeById,
  recipeFilter,
  sercheRecipe,
  mostPopularRecipe,
  recentViewRecipe,
  addShopingist,
  shopingList,
  deleteShopinglist,
};
