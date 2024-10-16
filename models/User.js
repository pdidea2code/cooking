const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email"],
    },
    mono: {
      type: Number,
      unique: true, // Ensures uniqueness
      sparse: true, // Allows null or undefined values
      // required: [true, 'Phone number is required'],  // Field must be present
      min: [1000000000, "Phone number must be at least 10 digits"], // Minimum value for 10-digit numbers
      max: [9999999999, "Phone number cannot exceed 10 digits"], // Max value for 10-digit numbers
      validate: {
        validator: function (v) {
          // Custom validation: Checks if it's a 10-digit number
          return /^\d{10}$/.test(v.toString());
        },
        message: (props) => `${props.value} is not a valid 10-digit phone number!`,
      },
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
      // required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      // validate: {
      //   validator: function (v) {
      //     // Regular expression for password validation
      //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
      //   },
      //   message:
      //     "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      // },
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
    fcm_token: {
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
