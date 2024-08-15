const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const {
  topRecipe,
  dashboardCount,
  resentRecipe,
  activeDeactiveUser,
} = require("../../controllers/admin/dashborController");
const router = express.Router();

router.get("/topRecipe", verifyAdminToken, topRecipe);
router.get("/dashboardcount", verifyAdminToken, dashboardCount);
router.get("/resentrecipe", verifyAdminToken, resentRecipe);
router.get("/activedeactiveuser", verifyAdminToken, activeDeactiveUser);

module.exports = router;
