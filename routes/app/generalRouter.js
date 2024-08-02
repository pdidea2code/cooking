const express = require("express");
const router = express.Router();
const { getDiet, getAllergie, getCategory, getCuisine, getMeal } = require("../../controllers/app/generalController");
const verifyAppToken = require("../../helper/verifyAppToken");

router.get("/getdiet", getDiet);
router.get("/getallergie", getAllergie);
router.get("/getcategory", verifyAppToken, getCategory);
router.get("/getcuisine", verifyAppToken, getCuisine);
router.get("/getmeal", verifyAppToken, getMeal);

module.exports = router;
