const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const Plan = require("../../models/Plan");

//Add Subscription Plan
const addPlan = async (req, res, next) => {
  try {
    const plan = await Plan.create({
      duration: req.body.duration,
      amount: req.body.amount,
    });

    successResponse(res, plan);
  } catch (error) {
    next(error);
  }
};

//Get All Plan
const getPlan = async (req, res, next) => {
  try {
    const plan = await Plan.find();
    if (plan.length === 0) return queryErrorRelatedResponse(req, res, 404, "Plan Not Found");

    successResponse(res, plan);
  } catch (error) {
    next(error);
  }
};

//Update Plan
const updatePlan = async (req, res, next) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return queryErrorRelatedResponse(req, res, 404, "Plan Not Found");

    req.body.duration ? (plan.duration = req.body.duration) : plan.duration;
    req.body.amount ? (plan.amount = req.body.amount) : plan.amount;
    await plan.save();
    successResponse(res, "Update Successfully");
  } catch (error) {
    next(error);
  }
};

//Update Plan Status
const updatePlanStatus = async (req, res, next) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return queryErrorRelatedResponse(req, res, 404, "Plan Not Found");

    plan.status = !plan.status;
    await plan.save();
    successResponse(res, "Status Updated Successfully");
  } catch (error) {
    next(error);
  }
};

//Delete Plan
const deletePlan = async (req, res, next) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return queryErrorRelatedResponse(req, res, 404, "Plan Not Found");

    successResponse(res, "Plan Deleted Successfully");
  } catch (error) {
    next(error);
  }
};

//Delete Multiple Plan
const deleteMultiPlans = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const result = await Plan.deleteMany({ _id: { $in: ids } });

    console.log(result);
    if (result.deletedCount === 0) return queryErrorRelatedResponse(req, res, 404, "No Plans Found To Delete");

    successResponse(res, `${result.deletedCount} Plans Deleted Successfully`);
  } catch (error) {
    next(error);
  }
};

module.exports = { addPlan, getPlan, updatePlan, updatePlanStatus, deletePlan, deleteMultiPlans };
