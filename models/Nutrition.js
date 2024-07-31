const mongoose = require("mongoose");

const NutritionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    amount: {
      type: String,
    },
    recipeid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "recipe",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("nutrition", NutritionSchema);
