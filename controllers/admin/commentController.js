const Comment = require("../../models/Comment");
const { queryErrorRelatedResponse, successResponse } = require("../../helper/sendResponse");

const getComment = async (req, res, next) => {
  try {
    const comment = await Comment.find().populate(["userid", "recipeid"]);
    // if (comment.length === 0) return queryErrorRelatedResponse(req, res, 404, "Comment Not Found");

    const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_COMMENT_IMAGE;
    const data = {
      comment,
      baseUrl: baseUrl,
    };
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getComment };
