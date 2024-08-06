const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const Comment = require("../../models/Comment");
const Recipe = require("../../models/Recipe");

//Add Comment
const addComment = async (req, res, next) => {
  try {
    const { commenttext, recipeid } = req.body;
    const recipe = await Recipe.findById(recipeid);

    if (!recipe) {
      return queryErrorRelatedResponse(req, res, 404, "Recipe Not Found");
    }

    const comment = await Comment.create({
      comment: commenttext,
      userid: req.user._id,
      recipeid: recipeid,
    });

    if (req.file && req.file.filename) {
      comment.image = req.file.filename;
      comment.isimage = true;
    }

    await comment.save();

    const commentcount = await Comment.countDocuments({ recipeid: recipeid });
    recipe.totalcomment = commentcount;
    await recipe.save();

    successResponse(res, "Comment Add successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = { addComment };
