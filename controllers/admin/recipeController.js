const deleteFiles = require("../../helper/deleteFiles");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const Ingredient = require("../../models/Ingredient");
const Nutrition = require("../../models/Nutrition");
const Recipe = require("../../models/Recipe");
const Step = require("../../models/Step");

const addRecipe = async (req, res, next) => {
  try {
    const { title, description, time, meal, nutrition, diet, cuisine, allergie, isSubscripe } = req.body;
    const recipe = await Recipe.create({
      title: title,
      description: description,
      time: time,
      isSubscripe: isSubscripe,
      meal: meal,
      nutrition: nutrition,
      allergie: allergie,
      diet: diet,
      cuisine: cuisine,
      image: req.files.image[0].filename,
      audio: req.files.audio[0].filename,
      video: req.files.video[0].filename,
    });
    successResponse(res, recipe);
  } catch (error) {
    next(error);
  }
};

const updateRecipe = async (req, res, next) => {
  try {
    const { title, description, time, meal, nutrition, diet, cuisine, allergie, isSubscripe } = req.body;
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) queryErrorRelatedResponse(req, res, 404, "Invalid Recipe");

    title ? (recipe.title = title) : recipe.title;
    description ? (recipe.description = description) : recipe.description;
    time ? (recipe.time = time) : recipe.time;
    isSubscripe ? (recipe.isSubscripe = isSubscripe) : recipe.isSubscripe;
    meal ? (recipe.meal = meal) : recipe.meal;
    nutrition ? (recipe.nutrition = nutrition) : recipe.nutrition;
    diet ? (recipe.diet = diet) : recipe.diet;
    cuisine ? (recipe.cuisine = cuisine) : recipe.cuisine;
    allergie ? (recipe.allergie = allergie) : recipe.allergie;
    if (req.files && req.files.image[0].filename) {
      deleteFiles("recipeimg/" + recipe.image);
      recipe.image = req.files.image[0].filename;
    }
    if (req.files && req.files.audio[0].filename) {
      deleteFiles("recipeimg/" + recipe.audio);
      recipe.audio = req.files.audio[0].filename;
    }
    if (req.files && req.files.video[0].filename) {
      deleteFiles("recipeimg/" + recipe.video);
      recipe.video = req.files.video[0].filename;
    }
    await recipe.save();
    successResponse(res, recipe);
  } catch (error) {
    next(error);
  }
};

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

const updateRecipeStatus = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) queryErrorRelatedResponse(req, res, 404, "Invalid Recipe");

    recipe.status = !recipe.status;
    await recipe.save();
    successResponse(res, "Recipe Status Update Successfully");
  } catch (error) {
    next(error);
  }
};

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
        await Nutrition.deleteMany({ recipeid: req.params.id });
        await Ingredient.deleteMany({ recipeid: req.params.id });
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

module.exports = { addRecipe, updateRecipe, getRecipe, updateRecipeStatus, deleteRecipe, deleteMultiRecipe };
