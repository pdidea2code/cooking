const express = require("express");
const verifyAppToken = require("../../helper/verifyAppToken");
const {
  //   createOrder,
  //   createPaymentIntent,
  checkout,
  complete,
  cancel,
  getPlan,
  // hooks,
} = require("../../controllers/app/planController");
const router = express.Router();

// router.post("/createOrder", verifyAppToken, createOrder);
// router.post("/createPaymentIntent", verifyAppToken, createPaymentIntent);
router.post("/checkout", verifyAppToken, checkout);
router.get("/complete", complete);
router.get("/cancel", cancel);
router.get("/getPlan", verifyAppToken, getPlan);
// router.post("/hooks", hooks);

module.exports = router;
