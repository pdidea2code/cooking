const Step = require("../../models/Step");
const deleteFiles = require("../../helper/deleteFiles");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");

//Add Recipe Step
const addStep = async (req, res, next) => {
  try {
    const { stepno, name, description, recipeid } = req.body;
    const step = await Step.create({
      stepno,
      name,
      description,
      recipeid,
      image: req.file.filename,
    });
    successResponse(res, step);
  } catch (error) {
    next(error);
  }
};

//Get Step By Recipe Id
const getRecipeWiseStep = async (req, res, next) => {
  try {
    const steps = await Step.find({ recipeid: req.params.id });
    if (!steps) return queryErrorRelatedResponse(req, res, 404, "Step Not Found");

    const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_STEP_IMAGE;
    const data = {
      steps,
      baseUrl: baseUrl,
    };
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

//Update Stap
const updateStep = async (req, res, next) => {
  try {
    const { stepno, name, description } = req.body;

    const step = await Step.findById(req.params.id);
    if (!step) return queryErrorRelatedResponse(req, res, 404, "Invalid Step");

    stepno ? (step.stepno = stepno) : step.stepno;
    name ? (step.name = name) : step.name;
    description ? (step.description = description) : step.description;

    if (req.file && req.file.filename) {
      deleteFiles("stepimg/" + step.image);
      step.image = req.file.filename;
    }

    await step.save();
    successResponse(res, step);
  } catch (error) {
    next(error);
  }
};

//Get All Step
const getSteps = async (req, res, next) => {
  try {
    const steps = await Step.find();
    if (!steps) return queryErrorRelatedResponse(req, res, 404, "Steps Not Found");

    const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_STEP_IMAGE;
    const data = {
      steps,
      baseUrl: baseUrl,
    };
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

//Delete Recipe Step
const deleteStep = async (req, res, next) => {
  try {
    const step = await Step.findById(req.params.id);
    if (!step) return queryErrorRelatedResponse(req, res, 404, "Invalid Step");

    deleteFiles("stepimg/" + step.image);

    await Step.deleteOne({ _id: req.params.id });
    successResponse(res, "Deleted Successfully");
  } catch (error) {
    next(error);
  }
};

//Delete Multiple Step
const deleteMultiStep = async (req, res, next) => {
  try {
    const { ids } = req.body;
    await Promise.all(
      ids.map(async (id) => {
        const step = await Step.findById(id);
        if (!step) return queryErrorRelatedResponse(req, res, 404, "Invalid Step");

        deleteFiles("stepimg/" + step.image);

        await Step.deleteOne({ _id: id });
      })
    );
    successResponse(res, "Deleted Successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = { addStep, updateStep, getSteps, deleteStep, deleteMultiStep, getRecipeWiseStep };
