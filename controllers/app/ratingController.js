const { queryErrorRelatedResponse, successResponse } = require("../../helper/sendResponse");
const Rating = require("../../models/Rating");
const Recipe = require("../../models/Recipe");

//Add Rating
const addRating = async (req, res, next) => {
  try {
    const { recipeid, rat } = req.body;

    if (!recipeid || recipeid === "") {
      return queryErrorRelatedResponse(req, res, 404, "Recipe required");
    }
    // if (rat == "") {
    //   return queryErrorRelatedResponse(req, res, 404, "Rating require");
    // }
    if (rat > 5 || rat < 0) {
      return queryErrorRelatedResponse(req, res, 400, "Rating should be between 0 to 5");
    }

    const recipe = await Recipe.findById(recipeid);
    if (!recipe) {
      return queryErrorRelatedResponse(req, res, 404, "Recipe not found");
    }

    const yourrating = await Rating.findOne({ userid: req.user._id, recipeid });
    if (yourrating) {
      yourrating.rating = rat;
      await yourrating.save();

      const allRatings = await Rating.find({ recipeid: recipeid });
      let totalReviews = allRatings.length;
      let totalRatings = allRatings.reduce((sum, review) => sum + review.rating, 0);
      let averageRating = totalRatings / totalReviews;
      averageRating = parseFloat(averageRating.toFixed(1));

      recipe.totalrating = totalRatings;
      recipe.totalreview = totalReviews;
      recipe.averagerating = averageRating;

      await recipe.save();

      return successResponse(res, yourrating);
    }

    const rating = await Rating.create({
      rating: parseFloat(rat),
      userid: req.user._id,
      recipeid: recipeid,
    });

    const allRatings = await Rating.find({ recipeid: recipeid });
    let totalReviews = allRatings.length;
    let totalRatings = allRatings.reduce((sum, review) => sum + review.rating, 0);
    let averageRating = totalRatings / totalReviews;
    averageRating = parseFloat(averageRating.toFixed(1));

    recipe.totalrating = totalRatings;
    recipe.totalreview = totalReviews;
    recipe.averagerating = averageRating;
    await recipe.save();

    successResponse(res, rating);
  } catch (error) {
    next(error);
  }
};

module.exports = { addRating };
