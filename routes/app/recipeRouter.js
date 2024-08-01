const express = require("express");
const router = express.Router();
const { latestRecipe, recipeById } = require("../../controllers/app/recipeConttroller");
const verifyAppToken = require("../../helper/verifyAppToken");

// Apply auth middleware to the route
router.get("/latestrecipes", verifyAppToken, latestRecipe);
router.get("/recipebyid/:id", verifyAppToken, recipeById);

module.exports = router;
