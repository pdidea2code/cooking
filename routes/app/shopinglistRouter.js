const express = require("express");
const router = express.Router();
const {
  addShopingist,
  shopingList,
  deleteShopinglist,
  toggleIngredientcheck,
  changePerson,
} = require("../../controllers/app/shopinglistController");
const verifyAppToken = require("../../helper/verifyAppToken");

router.post("/addShopingist", verifyAppToken, addShopingist);
router.get("/shopingList", verifyAppToken, shopingList);
router.delete("/deleteShopinglist/:id", verifyAppToken, deleteShopinglist);
router.post("/toggleIngredientcheck", verifyAppToken, toggleIngredientcheck);
router.post("/changePerson", verifyAppToken, changePerson);

module.exports = router;
