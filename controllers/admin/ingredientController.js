const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const Ingredient = require("../../models/Ingredient");

//Add Ingredient
const addIngredient = async (req, res, next) => {
  try {
    const reqbody = req.body;
    console.log(req.body);
    const data = await Promise.all(
      reqbody.map(async (data) => {
        const ingredient = await Ingredient.create({
          name: data.name,
          amount: data.amount,
          unit: data.unit,
          recipeid: data.recipeid,
        });
      })
    );

    successResponse(res, "Ingredient Add Successfully");
  } catch (error) {
    next(error);
  }
};

//Get All Ingredient
const getIngredient = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.find().populate("unit");
    if (!ingredient) return queryErrorRelatedResponse(req, res, 404, "Ingredient Not Foun");

    successResponse(res, ingredient);
  } catch (error) {
    next(error);
  }
};

//Get Ingredient By Recipe Id
const getRecipeWiseIngredient = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.find({ recipeid: req.params.id }).populate("unit");
    if (!ingredient) return queryErrorRelatedResponse(req, res, 404, "Ingredient Not Foun");

    successResponse(res, ingredient);
  } catch (error) {
    next(error);
  }
};

//Update Ingredient
const updateIngredient = async (req, res, next) => {
  try {
    const { name, amount, unit, recipeid } = req.body;
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) return queryErrorRelatedResponse(req, res, 404, "Ingredient Not Foun");

    name ? (ingredient.name = name) : ingredient.name;
    amount ? (ingredient.amount = amount) : ingredient.amount;
    unit ? (ingredient.unit = unit) : ingredient.unit;
    recipeid ? (ingredient.recipeid = recipeid) : ingredient.name;
    await ingredient.save();
    successResponse(res, ingredient);
  } catch (error) {
    recipeid;
    next(error);
  }
};

//Delete Ingridient
const deleteIngredient = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) return queryErrorRelatedResponse(req, res, 404, "Ingredient Not Foun");

    await Ingredient.deleteOne({ _id: req.params.id });
    successResponse(res, "Delete Successfully");
  } catch (error) {
    next(error);
  }
};

//Delete Multiple Ingredient
const deleteMultIngredient = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const data = await Promise.all(
      ids.map(async (data) => {
        await Ingredient.deleteOne({ _id: data });
      })
    );
    successResponse(res, "Delete Successfully");
  } catch (error) {
    next(error);
  }
};
module.exports = {
  addIngredient,
  getIngredient,
  getRecipeWiseIngredient,
  updateIngredient,
  deleteIngredient,
  deleteMultIngredient,
};
