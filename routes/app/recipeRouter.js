const express = require("express");
const router = express.Router();
const { latestRecipe, recipeById, recipeFilter, sercheRecipe } = require("../../controllers/app/recipeConttroller");
const verifyAppToken = require("../../helper/verifyAppToken");

router.get("/latestrecipes", verifyAppToken, latestRecipe);
router.get("/recipebyid/:id", verifyAppToken, recipeById);
router.post("/recipefilter", verifyAppToken, recipeFilter);
router.post("/sercherecipe", verifyAppToken, sercheRecipe);

module.exports = router;
