const mongoose = require("mongoose");

const ShopinglistSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    recipeid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "recipe",
    },
    person: {
      type: String,
      require: true,
    },
    // items_missing: {
    //   type: Number,
    //   default: 0,
    // },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("shopinglist", ShopinglistSchema);
