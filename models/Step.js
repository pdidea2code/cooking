const mongoose = require("mongoose");

const StepSchema = new mongoose.Schema(
  {
    stepno: {
      type: Number,
      require: [true, "Step Number require"],
    },
    name: {
      type: String,
      require: [true, "name is require"],
    },
    description: {
      type: String,
    },
    image: {
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

module.exports = mongoose.model("step", StepSchema);
