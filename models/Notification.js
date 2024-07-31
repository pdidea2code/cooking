const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema({
  title: {
    type: String,
  },

  description: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
  create: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("notification", NotificationSchema);
