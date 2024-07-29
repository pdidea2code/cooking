const Diet = require("../../models/Diet");
const {
  successResponse,
  queryErrorRelatedResponse,
  createResponse,
  deleteResponse,
} = require("../../helper/sendResponse");
const deleteFiles = require("../../helper/deleteFiles");

const addDiet = async (req, res, next) => {
  try {
    const diet = await Diet.create({
      name: req.body.name,
      image: req.file.filename,
    });
    if (!diet) return queryErrorRelatedResponse(req, res, 404, "Invalid Data!");

    createResponse(res, diet);
  } catch (error) {
    next(error);
  }
};

const getDiet = async (req, res, next) => {
  try {
    const diet = await Diet.find();
    if (!diet) return queryErrorRelatedResponse(req, res, 404, "Diet Not Found");

    const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_DIET_IAMGE;
    const data = {
      ...diet,
      baseUrl: baseUrl,
    };
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const updateDiet = async (req, res, next) => {
  try {
    const diet = await Diet.findById(req.params.id);
    if (!diet) return queryErrorRelatedResponse(req, res, 404, "Diet Not Found");

    req.body.name ? (diet.name = req.body.name) : diet.name;
    if (req.file.filename) {
      deleteFiles("dietimg/" + diet.image);
      diet.image = req.file.filename;
    }

    await diet.save();
    successResponse(res, diet);
  } catch (error) {
    next(error);
  }
};

const updateDietStatus = async (req, res, next) => {
  try {
    const diet = await Diet.findById(req.params.id);
    if (!diet) return queryErrorRelatedResponse(req, res, 404, "Diet Not Found");

    diet.status = !diet.status;
    await diet.save();
    successResponse(res, "Status Update Successfully!");
  } catch (error) {
    next(error);
  }
};

const deleteDiet = async (req, res, next) => {
  try {
    const diet = await Diet.findById(req.params.id);
    if (!diet) return queryErrorRelatedResponse(req, res, 404, "Diet Not Found");

    deleteFiles("dietimg/" + diet.image);
    const dietdelete = await Diet.deleteOne({ _id: req.params.id });
    if (dietdelete.deletedCount !== 1) {
      queryErrorRelatedResponse(req, res, 404, "Diet Not Delete");
    }
    deleteResponse(res, "Diet Delete Successfully.");
  } catch (error) {
    next(error);
  }
};

const deleteMultDiet = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const data = await Promise.all(
      ids.map(async (data) => {
        const diet = await Diet.findByIdAndDelete(data);
        deleteFiles("dietimg/" + diet.image);
      })
    );

    deleteResponse(res, "Diet Delete Successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addDiet,
  getDiet,
  updateDiet,
  updateDietStatus,
  deleteDiet,
  deleteMultDiet,
};
