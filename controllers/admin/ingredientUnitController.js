const { queryErrorRelatedResponse, createResponse, successResponse } = require("../../helper/sendResponse");
const Unit = require("../../models/IngredientUnit");

const addUnit = async (req, res, next) => {
  try {
    const unit = await Unit.create({
      name: req.body.name,
    });
    if (!unit) return queryErrorRelatedResponse(req, res, 404, "Unit Not Create");

    createResponse(res, unit);
  } catch (error) {
    next(error);
  }
};

const getUnit = async (req, res, next) => {
  try {
    const unit = await Unit.find();
    if (!unit) return queryErrorRelatedResponse(req, res, 404, "Unit Not Found");

    successResponse(res, unit);
  } catch (error) {
    next(error);
  }
};

const updateUnit = async (req, res, next) => {
  try {
    const unit = await Unit.findById(req.params.id);
    if (!unit) return queryErrorRelatedResponse(req, res, 404, "Unit Not Found");

    req.body.name ? (unit.name = req.body.name) : unit.name;
    await unit.save();
    successResponse(res, unit);
  } catch (error) {
    next(error);
  }
};

const updateUnitStatus = async (req, res, next) => {
  try {
    const unit = await Unit.findById(req.params.id);
    if (unit.deletedCount === 0) return queryErrorRelatedResponse(req, res, 404, "Unit Not Found");

    unit.status = !unit.status;
    await unit.save();
    successResponse(res, unit);
  } catch (error) {
    next(error);
  }
};

const deleteUnit = async (req, res, next) => {
  try {
    const unit = await Unit.deleteOne({ _id: req.params.id });
    if (!unit) return queryErrorRelatedResponse(req, res, 404, "Unit Not Found");

    successResponse(res, "Unit Delete Successfully");
  } catch (error) {
    next(error);
  }
};

const deleteMultUnit = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const data = await Promise.all(
      ids.map(async (data) => {
        const unit = await Unit.deleteOne({ _id: data });
      })
    );

    successResponse(res, "Unit Delete successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addUnit,
  getUnit,
  updateUnit,
  updateUnitStatus,
  deleteUnit,
  deleteMultUnit,
};
