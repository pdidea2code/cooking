const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema(
  {
    duration: {
      type: String,
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    day: {
      type: Number,
      require: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("plan", PlanSchema);
