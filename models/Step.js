const mongoose = require("mongoose");

const StepSchem = new mongoose.Schema({
  stepno: {
    type: Number,
    require: [true, "Step Number require"],
  },
  name: {
    type: String,
  },
  image: {
    type: String,
  },
  recipeid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "recipe",
  },
});
