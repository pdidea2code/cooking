const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email Id is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    image: {
      type: String,
    },

    accessToken: {
      type: String,
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
AdminSchema.pre("save", async function (next) {
  const admin = this;
  if (admin.isModified("password")) {
    admin.password = await bcrypt.hashSync(admin.password, 12);
  }
  next();
});

//Admin Generate Auth Token
AdminSchema.methods.generateAuthToken = function (data) {
  const admin = this;
  const id = { _id: admin._id };
  data = { ...data, ...id };
  const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "300m" });
  return token;
};

//Admin Genrate Refresh Token
AdminSchema.methods.generateRefreshToken = function (data) {
  const admin = this;
  const id = { _id: admin._id };
  data = { ...data, ...id };
  const token = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
  return token;
};

module.exports = mongoose.model("admin", AdminSchema);
