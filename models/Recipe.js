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
      type: Number,
      default: 0,
    },
    totalreview: {
      type: Number,
      default: 0,
    },
    averagerating: {
      type: Number,
      default: 0,
    },
    totalcomment: {
      type: Number,
      default: 0,
    },
    videourl: {
      type: String,
      default: null,
    },
    video: {
      type: String,
      default: null,
    },
    videotype: {
      type: Number, //0:video url  video ,1:uploded
      enum: [0, 1],
    },
    audio: {
      type: String,
      default: null,
    },
    meal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "meal",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },

    allergie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "allergie",
    },

    diet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "diet",
    },

    cuisine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cuisine",
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

module.exports = mongoose.model("recipe", RecipeSchema);
