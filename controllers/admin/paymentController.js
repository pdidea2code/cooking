const Payment = require("../../models/Payment");
const { successResponse, queryErrorRelatedResponse, createResponse } = require("../../helper/sendResponse");

const getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.find().populate(["userid", "planid"]);
    if (!payment) return queryErrorRelatedResponse(req, res, 404, "Payment not found");

    successResponse(res, payment);
  } catch (error) {
    next(error);
  }
};

module.exports = { getPayment };
