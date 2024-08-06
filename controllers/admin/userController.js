const { queryErrorRelatedResponse, successResponse } = require("../../helper/sendResponse");
const User = require("../../models/User");

//Get All User
const getUser = async (req, res, next) => {
  try {
    const user = await User.find().populate(["diet", "allergie"]);
    if (!user) return queryErrorRelatedResponse(req, res, 404, "User Not Found");

    const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_USER_PROFILE_PATH;
    const data = {
      user: user,
      baseUrl: baseUrl,
    };
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUser,
};
