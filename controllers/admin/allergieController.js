const { queryErrorRelatedResponse, createResponse, successResponse } = require("../../helper/sendResponse");
const Allergie = require("../../models/Allergie");

//Add Allergie
const addAllergie = async (req, res, next) => {
  try {
    const allergie = await Allergie.create({
      name: req.body.name,
    });
    if (!allergie) return queryErrorRelatedResponse(req, res, 404, "Allergie Not Create");

    createResponse(res, allergie);
  } catch (error) {
    next(error);
  }
};

//Get All Allergie
const getAllergie = async (req, res, next) => {
  try {
    const allergie = await Allergie.find();
    if (!allergie) return queryErrorRelatedResponse(req, res, 404, "Alletgie Not Found");

    successResponse(res, allergie);
  } catch (error) {
    next(error);
  }
};

//Update Allergie
const updateAllergie = async (req, res, next) => {
  try {
    const allergie = await Allergie.findById(req.params.id);
    if (!allergie) return queryErrorRelatedResponse(req, res, 404, "Alletgie Not Found");

    req.body.name ? (allergie.name = req.body.name) : allergie.name;
    await allergie.save();
    successResponse(res, allergie);
  } catch (error) {
    next(error);
  }
};

//Update Allergie Status
const updateAllergieStatus = async (req, res, next) => {
  try {
    const allergie = await Allergie.findById(req.params.id);
    if (allergie.deletedCount === 0) return queryErrorRelatedResponse(req, res, 404, "Alletgie Not Found");

    allergie.status = !allergie.status;
    await allergie.save();
    successResponse(res, allergie);
  } catch (error) {
    next(error);
  }
};

const deleteAllergie = async (req, res, next) => {
  try {
    const allergie = await Allergie.deleteOne({ _id: req.params.id });
    if (!allergie) return queryErrorRelatedResponse(req, res, 404, "Alletgie Not Found");

    successResponse(res, "Allergie Delete Successfully");
  } catch (error) {
    next(error);
  }
};

const deleteMultAllergie = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const data = await Promise.all(
      ids.map(async (data) => {
        const allergie = await Allergie.deleteOne({ _id: data });
      })
    );

    successResponse(res, "Allergie Delete successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addAllergie,
  getAllergie,
  updateAllergie,
  updateAllergieStatus,
  deleteAllergie,
  deleteMultAllergie,
};
