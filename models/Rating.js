const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
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

module.exports = mongoose.model("rating", RatingSchema);
