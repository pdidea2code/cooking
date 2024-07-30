const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    mono: {
      type: Number,
      unique: true,
      sparse: true,
    },
    google_id: {
      type: String,
      unique: true,
      sparse: true,
    },
    apple_id: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
    },
    notification: {
      type: Boolean,
      default: true,
    },
    diet: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "diet",
      },
    ],
    allergie: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "allergie",
      },
    ],
    issubscribe: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: null,
    },
    otp: {
      type: String,
      default: null,
    },
    expireOtpTime: {
      type: String,
      default: null,
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

//Bcrypt password before save
UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hashSync(user.password, 12);
  }
  next();
});

UserSchema.methods.generateAuthToken = function (data) {
  const user = this;
  const id = { _id: user._id };
  data = { ...data, ...id };
  const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "300m" });
  return token;
};

UserSchema.methods.generateRefreshToken = function (data) {
  const user = this;
  const id = { _id: user._id };
  data = { ...data, ...id };
  const token = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
  return token;
};

module.exports = mongoose.model("user", UserSchema);
