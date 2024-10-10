const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      require: true,
    },
    paymentId: {
      type: String,
    },

    userid: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "user",
    },
    amount: {
      type: String,
    },
    planid: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "plan",
    },
    currency: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("payment", PaymentSchema);
