const { queryErrorRelatedResponse, createResponse, successResponse } = require("../../helper/sendResponse");
const Cuisine = require("../../models/Cuisine");

const addCuisine = async (req, res, next) => {
  try {
    const cuisine = await Cuisine.create({
      name: req.body.name,
    });
    if (!cuisine) return queryErrorRelatedResponse(req, res, 404, "Cuisine Not Create");

    createResponse(res, cuisine);
  } catch (error) {
    next(error);
  }
};

const getCuisine = async (req, res, next) => {
  try {
    const cuisine = await Cuisine.find();
    if (!cuisine) return queryErrorRelatedResponse(req, res, 404, "Cuisine Not Found");

    successResponse(res, cuisine);
  } catch (error) {
    next(error);
  }
};

const updateCuisine = async (req, res, next) => {
  try {
    const cuisine = await Cuisine.findById(req.params.id);
    if (!cuisine) return queryErrorRelatedResponse(req, res, 404, "Cuisine Not Found");

    req.body.name ? (cuisine.name = req.body.name) : cuisine.name;
    await cuisine.save();
    successResponse(res, cuisine);
  } catch (error) {
    next(error);
  }
};

const updateCuisineStatus = async (req, res, next) => {
  try {
    const cuisine = await Cuisine.findById(req.params.id);
    if (!cuisine) return queryErrorRelatedResponse(req, res, 404, "Cuisine Not Found");

    cuisine.status = !cuisine.status;
    await cuisine.save();
    successResponse(res, cuisine);
  } catch (error) {
    next(error);
  }
};

const deleteCuisine = async (req, res, next) => {
  try {
    const cuisine = await Cuisine.deleteOne({ _id: req.params.id });
    if (cuisine.deletedCount === 0) return queryErrorRelatedResponse(req, res, 404, "Cuisine Not Found");

    successResponse(res, "Cuisine Delete Successfully");
  } catch (error) {
    next(error);
  }
};

const deleteMultCuisine = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const data = await Promise.all(
      ids.map(async (data) => {
        const cuisine = await Cuisine.deleteOne({ _id: data });
      })
    );

    successResponse(res, "Cuisine Delete successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCuisine,
  getCuisine,
  updateCuisine,
  updateCuisineStatus,
  deleteCuisine,
  deleteMultCuisine,
};
