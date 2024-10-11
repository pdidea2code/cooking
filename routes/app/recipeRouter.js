const express = require("express");
const router = express.Router();
const {
  latestRecipe,
  recipeById,
  recipeFilter,
  sercheRecipe,
  mostPopularRecipe,
  recentViewRecipe,
  addShopingist,
  shopingList,
  deleteShopinglist,
} = require("../../controllers/app/recipeConttroller");
const verifyAppToken = require("../../helper/verifyAppToken");

router.get("/latestrecipes", verifyAppToken, latestRecipe);
router.get("/recipebyid/:id", verifyAppToken, recipeById);
router.post("/recipefilter", verifyAppToken, recipeFilter);
router.post("/sercherecipe", verifyAppToken, sercheRecipe);
router.get("/mostpopularrecipe", verifyAppToken, mostPopularRecipe);
router.get("/recentviewrecipe", verifyAppToken, recentViewRecipe);
// router.post("/addShopingist", verifyAppToken, addShopingist);
// router.get("/shopingList", verifyAppToken, shopingList);
// router.get("/deleteshopinglist/:id", verifyAppToken, deleteShopinglist);

module.exports = router;
