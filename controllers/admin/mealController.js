const { queryErrorRelatedResponse, createResponse, successResponse } = require("../../helper/sendResponse");
const Meal = require("../../models/Meal");

const addMeal = async (req, res, next) => {
  try {
    const meal = await Meal.create({
      name: req.body.name,
    });
    if (!meal) return queryErrorRelatedResponse(req, res, 404, "Meal Not Create");

    createResponse(res, meal);
  } catch (error) {
    next(error);
  }
};

const getMeal = async (req, res, next) => {
  try {
    const meal = await Meal.find();
    if (!meal) return queryErrorRelatedResponse(req, res, 404, "Meal Not Found");

    successResponse(res, meal);
  } catch (error) {
    next(error);
  }
};

const updateMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) return queryErrorRelatedResponse(req, res, 404, "Meal Not Found");

    req.body.name ? (meal.name = req.body.name) : meal.name;
    await meal.save();
    successResponse(res, meal);
  } catch (error) {
    next(error);
  }
};

const updateMealStatus = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) return queryErrorRelatedResponse(req, res, 404, "Meal Not Found");

    meal.status = !meal.status;
    await meal.save();
    successResponse(res, meal);
  } catch (error) {
    next(error);
  }
};

const deleteMeal = async (req, res, next) => {
  try {
    const meal = await Meal.deleteOne({ _id: req.params.id });
    if (meal.deletedCount === 0) return queryErrorRelatedResponse(req, res, 404, "Meal Not Found");

    successResponse(res, "Meal Delete Successfully");
  } catch (error) {
    next(error);
  }
};

const deleteMultMeal = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const data = await Promise.all(
      ids.map(async (data) => {
        const meal = await Meal.deleteOne({ _id: data });
      })
    );

    successResponse(res, "Meal Delete successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addMeal,
  getMeal,
  updateMeal,
  updateMealStatus,
  deleteMeal,
  deleteMultMeal,
};
