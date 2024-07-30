const Category = require("../../models/Category");
const {
  successResponse,
  queryErrorRelatedResponse,
  createResponse,
  deleteResponse,
} = require("../../helper/sendResponse");
const deleteFiles = require("../../helper/deleteFiles");

const addCategory = async (req, res, next) => {
  try {
    const category = await Category.create({
      name: req.body.name,
      image: req.file.filename,
    });
    if (!category) return queryErrorRelatedResponse(req, res, 404, "Invalid Data!");

    createResponse(res, category);
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const category = await Category.find();
    if (!category) return queryErrorRelatedResponse(req, res, 404, "Category Not Found");

    const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_CATEGORY_IAMGE;
    const data = {
      category,
      baseUrl: baseUrl,
    };
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return queryErrorRelatedResponse(req, res, 404, "Category Not Found");

    req.body.name ? (category.name = req.body.name) : category.name;
    if (req.file.filename) {
      deleteFiles("categoryimg/" + category.image);
      category.image = req.file.filename;
    }

    await category.save();
    successResponse(res, category);
  } catch (error) {
    next(error);
  }
};

const updateCategoryStatus = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return queryErrorRelatedResponse(req, res, 404, "Category Not Found");

    category.status = !category.status;
    await category.save();
    successResponse(res, "Status Update Successfully!");
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return queryErrorRelatedResponse(req, res, 404, "Category Not Found");

    deleteFiles("categoryimg/" + category.image);
    const categorydelete = await Category.deleteOne({ _id: req.params.id });
    if (categorydelete.deletedCount !== 1) {
      queryErrorRelatedResponse(req, res, 404, "Category Not Delete");
    }
    deleteResponse(res, "Category Delete Successfully.");
  } catch (error) {
    next(error);
  }
};

const deleteMultCategory = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const data = await Promise.all(
      ids.map(async (data) => {
        const category = await Category.findByIdAndDelete(data);
        deleteFiles("categoryimg/" + category.image);
      })
    );

    deleteResponse(res, "Category Delete Successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCategory,
  getCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
  deleteMultCategory,
};
