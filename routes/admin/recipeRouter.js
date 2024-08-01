const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const {
  addRecipe,
  updateRecipe,
  getRecipe,
  updateRecipeStatus,
  deleteRecipe,
  deleteMultiRecipe,
  updateRecipeSubscripe,
} = require("../../controllers/admin/recipeController");
const { multiDiffFileUpload, singleFileUpload } = require("../../helper/imageUpload");
const route = express.Router();

route.post(
  "/addrecipe",
  verifyAdminToken,
  multiDiffFileUpload("public/images/recipeimg", [
    { name: "image", maxCount: 1, allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"] },
    { name: "video", maxCount: 1, allowedMimes: ["video/mp4"] },
    { name: "audio", maxCount: 1, allowedMimes: ["audio/mp3", "audio/mpeg"] },
  ]),
  addRecipe
);
route.post(
  "/updaterecipe/:id",
  verifyAdminToken,
  multiDiffFileUpload("public/images/recipeimg", [
    { name: "image", maxCount: 1, allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"] },
    { name: "video", maxCount: 1, allowedMimes: ["video/mp4"] },
    { name: "audio", maxCount: 1, allowedMimes: ["audio/mp3", "audio/mpeg"] },
  ]),
  updateRecipe
);
route.get("/getrecipe", verifyAdminToken, getRecipe);
route.put("/updaterecipestatus/:id", verifyAdminToken, updateRecipeStatus);
route.put("/updaterecipesubscripe/:id", verifyAdminToken, updateRecipeSubscripe);
route.delete("/deleterecipe/:id", verifyAdminToken, deleteRecipe);
route.delete("/deletemultirecipe", verifyAdminToken, deleteMultiRecipe);

module.exports = route;
