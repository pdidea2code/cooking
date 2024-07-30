const mongoose = require("mongoose");

const Unit = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "name is require"],
  },
  status: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model();
