const mongoose = require("mongoose");

const RecenviewSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "user",
    },
    recipeid: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "recipe",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("recentview", RecenviewSchema);
