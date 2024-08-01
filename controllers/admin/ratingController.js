const { queryErrorRelatedResponse, successResponse } = require("../../helper/sendResponse");
const Rating = require("../../models/Rating");

const getRating = async (req, res, next) => {
  try {
    const rating = await Rating.find().populate(["userid", "recipeid"]);
    // if (rating.length === 0) return queryErrorRelatedResponse(req, res, 404, "Rating Not Found");

    successResponse(res, rating);
  } catch (error) {
    next(error);
  }
};

module.exports = { getRating };
