const mongoose = require("mongoose");

const nutritionSchema = new mongoose.model(
  {
    name: {
      type: String,
    },
    amount: {
      type: String,
    },
    // status: {
    //   type: Boolean,
    //   default: true,
    // },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
