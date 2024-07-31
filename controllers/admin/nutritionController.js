const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const Nutrition = require("../../models/Nutrition");

const addNutrition = async (req, res, next) => {
  try {
    const reqbody = req.body;

    const data = await Promise.all(
      reqbody.map(async (data) => {
        await Nutrition.create({
          name: data.name,
          amount: data.amount,
          recipeid: data.recipeid,
        });
      })
    );

    successResponse(res, "Nutrition Add Successfully");
  } catch (error) {
    next(error);
  }
};

const getNutrition = async (req, res, next) => {
  try {
    const nutrition = await Nutrition.find();
    if (!nutrition) return queryErrorRelatedResponse(req, res, 404, "Nutrition Not Found");

    successResponse(res, nutrition);
  } catch (error) {
    next(error);
  }
};

const getRecipeWiseNutrition = async (req, res, next) => {
  try {
    const nutrition = await Nutrition.find({ recipeid: req.params.id });
    if (!nutrition) return queryErrorRelatedResponse(req, res, 404, "Nutrition Not Found");

    successResponse(res, nutrition);
  } catch (error) {
    next(error);
  }
};

const updateNutrition = async (req, res, next) => {
  try {
    const { name, amount, recipeid } = req.body;
    const nutrition = await Nutrition.findById(req.params.id);
    if (!nutrition) return queryErrorRelatedResponse(req, res, 404, "Nutrition Not Found");

    if (name) nutrition.name = name;
    if (amount) nutrition.amount = amount;
    if (recipeid) nutrition.recipeid = recipeid;

    await nutrition.save();
    successResponse(res, nutrition);
  } catch (error) {
    next(error);
  }
};

const deleteNutrition = async (req, res, next) => {
  try {
    const nutrition = await Nutrition.findById(req.params.id);
    if (!nutrition) return queryErrorRelatedResponse(req, res, 404, "Nutrition Not Found");

    await Nutrition.deleteOne({ _id: req.params.id });
    successResponse(res, "Delete Successfully");
  } catch (error) {
    next(error);
  }
};

const deleteMultNutrition = async (req, res, next) => {
  try {
    const { ids } = req.body;
    await Promise.all(
      ids.map(async (id) => {
        await Nutrition.deleteOne({ _id: id });
      })
    );
    successResponse(res, "Delete Successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addNutrition,
  getNutrition,
  getRecipeWiseNutrition,
  updateNutrition,
  deleteNutrition,
  deleteMultNutrition,
};
