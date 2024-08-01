const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
    },
    image: {
      type: String,
    },
    isimage: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("comment", CommentSchema);
