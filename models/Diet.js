const mongoose = require("mongoose");

const DietSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Diet name is required."],
    },
    image: {
      type: String,
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

module.exports = mongoose.model("diet", DietSchema);
