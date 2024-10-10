const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const {
  addStep,
  updateStep,
  getSteps,
  deleteStep,
  deleteMultiStep,
  getRecipeWiseStep,
} = require("../../controllers/admin/stepController");
const { singleFileUpload } = require("../../helper/imageUpload");
const route = express.Router();

route.post(
  "/addstep",
  verifyAdminToken,
  singleFileUpload(
    "public/images/stepimg",
    ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    1024 * 1024,
    "image"
  ),
  addStep
);

route.post(
  "/updatestep/:id",
  verifyAdminToken,
  singleFileUpload(
    "public/images/stepimg",
    ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    1024 * 1024,
    "image"
  ),
  updateStep
);

route.get("/getsteps", verifyAdminToken, getSteps);
route.get("/getrecipewisestep/:id", verifyAdminToken, getRecipeWiseStep);

route.delete("/deletestep/:id", verifyAdminToken, deleteStep);

route.delete("/deletemultistep", verifyAdminToken, deleteMultiStep);

module.exports = route;
