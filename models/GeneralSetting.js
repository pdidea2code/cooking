const mongoose = require("mongoose");

const GeneralSettingSchema = new mongoose.Schema(
  {
    termsandcondition: {
      type: String,
      default: "Terms & Condition",
    },
    privacypolicy: {
      type: String,
      default: "Privacy Policy",
    },
    email: {
      type: String,
      default: "example@gmail.com",
    },
    password: {
      type: String,
      default: "qwer qwer qwer qwer",
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("generalsetting", GeneralSettingSchema);
