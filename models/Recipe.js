const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    image: {
      type: String,
      default: null,
    },
    description: {
      type: String,
    },
    isSubscripe: {
      type: Boolean,
      default: false,
    },
    time: {
      type: String,
    },
    totalrating: {
      type: String,
      default: 0,
    },
    totalreview: {
      type: String,
      default: 0,
    },
    averagerating: {
      type: String,
      default: 0,
    },
    totalcomment: {
      type: String,
      default: 0,
    },
    video: {
      type: String,
      default: null,
    },
    audio: {
      type: String,
      default: null,
    },
    meal: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "meal",
      },
    ],
    nutrition: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "nutrition",
      },
    ],
    allergie: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "allergie",
      },
    ],
    diet: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "diet",
      },
    ],
    cuisine: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cuisine",
      },
    ],
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

module.exports = mongoose.model("recipe", RecipeSchema);
