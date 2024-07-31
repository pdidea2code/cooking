const mongoose = require("mongoose");

const IngredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    amount: {
      type: String,
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "unit",
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

module.exports = mongoose.model("ingredient", IngredientSchema);
