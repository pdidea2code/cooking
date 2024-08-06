const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const GeneralSetting = require("../../models/GeneralSetting");

//Add Genetal Setting
const addGeneralSetting = async (req, res, next) => {
  try {
    const generalsetting = await GeneralSetting.create({});
    successResponse(res, generalsetting);
  } catch (error) {
    next(error);
  }
};

//Update General Setting
const updateGeneralSetting = async (req, res, next) => {
  try {
    const generalsetting = await GeneralSetting.findOne();

    console.log(generalsetting);

    req.body.termsandcondition
      ? (generalsetting.termsandcondition = req.body.termsandcondition)
      : generalsetting.termsandcondition;
    req.body.privacypolicy ? (generalsetting.privacypolicy = req.body.privacypolicy) : generalsetting.privacypolicy;
    req.body.email ? (generalsetting.email = req.body.email) : generalsetting.email;
    req.body.password ? (generalsetting.password = req.body.password) : generalsetting.password;
    await generalsetting.save();
    successResponse(res, "Update Successfully");
  } catch (error) {
    next(error);
  }
};

// Get General Setting
const getGeneralSetting = async (req, res, next) => {
  try {
    const generalsetting = await GeneralSetting.findOne();
    if (!generalsetting) return queryErrorRelatedResponse(req, res, 404, "Setting Not Found");

    successResponse(res, generalsetting);
  } catch (error) {
    next(error);
  }
};

module.exports = { addGeneralSetting, updateGeneralSetting, getGeneralSetting };
