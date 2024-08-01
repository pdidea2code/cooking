const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema(
  {
    duration: {
      type: String,
    },
    amount: {
      type: Number,
    },
    status: {
      type: String,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("plan", PlanSchema);
