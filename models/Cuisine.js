const mongoose = require("mongoose");

const CuisineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Cuisine Name is required"],
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

module.exports = mongoose.model("cuisine", CuisineSchema);
