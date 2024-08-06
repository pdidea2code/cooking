const deleteFiles = require("../../helper/deleteFiles");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const Comment = require("../../models/Comment");
const Ingredient = require("../../models/Ingredient");
const Nutrition = require("../../models/Nutrition");
const Recipe = require("../../models/Recipe");
const Step = require("../../models/Step");
const Rating = require("../../models/Rating");

//Add Recipe
const addRecipe = async (req, res, next) => {
  try {
    const { title, description, time, meal, category, diet, cuisine, allergie, isSubscripe } = req.body;
    const recipe = await Recipe.create({
      title: title,
      description: description,
      time: time,
      isSubscripe: isSubscripe,
      meal: meal,
      category: category,
      allergie: allergie,
      diet: diet,
      cuisine: cuisine,
    });
    if (req.body.videourl) {
      recipe.videourl = req.body.videourl;
      recipe.video = null;
      recipe.videotype = 0;
    }
    if (req.files) {
      if (req.files.video && req.files.video[0] && req.files.video[0].filename) {
        recipe.video = req.files.video[0].filename;

        recipe.videotype = 1;
      }

      if (req.files.image && req.files.image[0] && req.files.image[0].filename) {
        recipe.image = req.files.image[0].filename;
      }
      if (req.files.audio && req.files.audio[0] && req.files.audio[0].filename) {
        recipe.audio = req.files.audio[0].filename;
      }
    }
    await recipe.save();
    successResponse(res, recipe);
  } catch (error) {
    next(error);
  }
};

//Update Recipe
const updateRecipe = async (req, res, next) => {
  try {
    const { title, description, time, meal, category, diet, cuisine, allergie, isSubscripe } = req.body;

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return queryErrorRelatedResponse(req, res, 404, "Invalid Recipe");

    if (title) recipe.title = title;
    if (description) recipe.description = description;
    if (time) recipe.time = time;
    if (meal) recipe.meal = meal;
    if (category) recipe.category = category;
    if (diet) recipe.diet = diet;
    if (cuisine) recipe.cuisine = cuisine;
    if (allergie) recipe.allergie = allergie;
    if (req.body.videourl) {
      deleteFiles("recipeimg/" + recipe.video);
      recipe.videourl = req.body.videourl;
      recipe.video = null;
      recipe.videotype = 0;
    }

    if (req.files) {
      if (req.files.image && req.files.image[0] && req.files.image[0].filename) {
        deleteFiles("recipeimg/" + recipe.image);
        recipe.image = req.files.image[0].filename;
      }
      if (req.files.audio && req.files.audio[0] && req.files.audio[0].filename) {
        deleteFiles("recipeimg/" + recipe.audio);
        recipe.audio = req.files.audio[0].filename;
      }
      if (req.files.video && req.files.video[0] && req.files.video[0].filename) {
        deleteFiles("recipeimg/" + recipe.video);
        recipe.video = req.files.video[0].filename;
        recipe.videotype = 1;
      }
    }

    await recipe.save();
    successResponse(res, recipe);
  } catch (error) {
    next(error);
  }
};

//Get Recope
const getRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.find();
    if (!recipe) return queryErrorRelatedResponse(req, res, 404, "Recipe Not Found");

    const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_RECIPE_IAMGE;
    const data = {
      recipe,
      baseUrl: baseUrl,
    };
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

//Update Recipe Is Subscripe
const updateRecipeSubscripe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return queryErrorRelatedResponse(req, res, 404, "Invalid Recipe");

    recipe.isSubscripe = !recipe.isSubscripe;
    await recipe.save();
    successResponse(res, "Recipe Status Update Successfully");
  } catch (error) {
    next(error);
  }
};

//Update Recipe Status
const updateRecipeStatus = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return queryErrorRelatedResponse(req, res, 404, "Invalid Recipe");

    recipe.status = !recipe.status;
    await recipe.save();
    successResponse(res, "Recipe Status Update Successfully");
  } catch (error) {
    next(error);
  }
};

//Delete Recipe
const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) queryErrorRelatedResponse(req, res, 404, "Invalid Recipe");

    const steps = await Step.find({ recipeid: req.params.id });
    const deleteStep = await Promise.all(
      steps.map(async (data) => {
        deleteFiles("stepimg/" + data.image);
        await Step.deleteOne({ _id: data._id });
      })
    );

    const comments = await Comment.find({ recipeid: req.params.id });
    const deleteComment = await Promise.all(
      steps.map(async (data) => {
        deleteFiles("commentimg/" + data.image);
        await Comment.deleteOne({ _id: data._id });
      })
    );
    await Rating.deleteMany({ recipeid: req.params.id });
    await Nutrition.deleteMany({ recipeid: req.params.id });
    await Ingredient.deleteMany({ recipeid: req.params.id });
    deleteFiles("recipeimg/" + recipe.image);
    deleteFiles("recipeimg/" + recipe.audio);
    deleteFiles("recipeimg/" + recipe.video);

    await Recipe.deleteOne({ _id: req.params.id });
    successResponse(res, "Delete Successfully");
  } catch (error) {
    next(error);
  }
};

//Delete Multinple Recipe
const deleteMultiRecipe = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const data = await Promise.all(
      ids.map(async (data) => {
        const recipe = await Recipe.findById(data);
        if (!recipe) queryErrorRelatedResponse(req, res, 404, "Invalid Recipe");

        const steps = await Step.find({ recipeid: data });
        const deleteStep = await Promise.all(
          steps.map(async (step) => {
            deleteFiles("stepimg/" + step.image);
            await Step.deleteOne({ _id: step._id });
          })
        );
        const comments = await Comment.find({ recipeid: req.params.id });
        const deleteComment = await Promise.all(
          steps.map(async (data) => {
            deleteFiles("commentimg/" + data.image);
            await Comment.deleteOne({ _id: data._id });
          })
        );
        await Rating.deleteMany({ recipeid: req.params.id });
        await Nutrition.deleteMany({ recipeid: data });
        await Ingredient.deleteMany({ recipeid: data });
        deleteFiles("recipeimg/" + recipe.image);
        deleteFiles("recipeimg/" + recipe.audio);
        deleteFiles("recipeimg/" + recipe.video);

        await Recipe.deleteOne({ _id: data });
      })
    );
    successResponse(res, "Delete Successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addRecipe,
  updateRecipe,
  getRecipe,
  updateRecipeStatus,
  deleteRecipe,
  deleteMultiRecipe,
  updateRecipeSubscripe,
};
