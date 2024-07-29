const mongoose = require("mongoose");

const AllergieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Allergie Name is required"],
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

module.exports = mongoose.model("allergie", AllergieSchema);
