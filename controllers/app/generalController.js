const { queryErrorRelatedResponse, successResponse } = require("../../helper/sendResponse");
const Allergie = require("../../models/Allergie");
const Category = require("../../models/Category");
const Cuisine = require("../../models/Cuisine");
const Diet = require("../../models/Diet");
const Meal = require("../../models/Meal");

//Get All Diet
const getDiet = async (req, res, next) => {
  try {
    const diet = await Diet.find({ status: true });
    if (!diet) return queryErrorRelatedResponse(req, res, 404, "Diet Not Found");

    const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_DIET_IAMGE;
    successResponse(res, diet, baseUrl);
  } catch (error) {
    next(error);
  }
};

//Get All Allergie
const getAllergie = async (req, res, next) => {
  try {
    const allergie = await Allergie.find({ status: true });
    if (!allergie) return queryErrorRelatedResponse(req, res, 404, "Allergie Not Found");

    successResponse(res, allergie);
  } catch (error) {
    next(error);
  }
};

//Get All Cateory
const getCategory = async (req, res, next) => {
  try {
    const category = await Category.find({ status: true });
    if (!category) return queryErrorRelatedResponse(req, res, 404, "Category Not Found");

    const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_CATEGORY_IAMGE;
    successResponse(res, category, baseUrl);
  } catch (error) {
    next(error);
  }
};

//Get All Cuisine
const getCuisine = async (req, res, next) => {
  try {
    const cuisine = await Cuisine.find({ status: true });
    if (!cuisine) return queryErrorRelatedResponse(req, res, 404, "Cuisine Not Found");

    successResponse(res, cuisine);
  } catch (error) {
    next(error);
  }
};

//Get All Meal
const getMeal = async (req, res, next) => {
  try {
    const meal = await Meal.find({ status: true });
    if (!meal) return queryErrorRelatedResponse(req, res, 404, "Meal Not Found");

    successResponse(res, meal);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDiet,
  getAllergie,
  getCategory,
  getCuisine,
  getMeal,
};
