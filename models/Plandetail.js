const mongoose = require("mongoose");

const PlandetilSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    planid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "plan",
    },
    paymentid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payment",
    },
    planexpire: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("plandetail", PlandetilSchema);
