const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const deleteFiles = require("../../helper/deleteFiles");
const { sendMail } = require("../../helper/emailSender");
const twilio = require("twilio");
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const jwt = require("jsonwebtoken");

//Signup User
const signup = async (req, res, next) => {
  try {
    const { email, password, name, mono } = req.body;
    console.log("signup");
    console.log(req.body);

    if (!name) {
      return queryErrorRelatedResponse(req, res, 400, "Name is required");
    }
    if (email === "") {
      return queryErrorRelatedResponse(req, res, 400, "Email is required");
    }
    if (mono === "") {
      return queryErrorRelatedResponse(req, res, 400, "Phone No is required");
    }

    if (email) {
      if (!email) {
        return queryErrorRelatedResponse(req, res, 400, "Email is required");
      }
      // Validate password for email-based signup
      if (!password) {
        return queryErrorRelatedResponse(req, res, 400, "Password is required for email signup.");
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return queryErrorRelatedResponse(req, res, 400, "User already exists with this email.");
      }

      const user = await User.create({ email, password, name });
      const token = user.generateAuthToken({ email: req.body.email });
      const refresh_token = user.generateRefreshToken({ email: req.body.email });
      const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_USER_PROFILE_PATH;
      const data = { token: token, refresh_token: refresh_token, user: user };
      return successResponse(res, data, baseUrl);
    } else if (mono) {
      if (!mono) {
        return queryErrorRelatedResponse(req, res, 400, "Phone No is required");
      }
      // Validate phone number (mono) for phone-based signup
      const existingUser = await User.findOne({ mono });
      if (existingUser) {
        return queryErrorRelatedResponse(req, res, 400, "User already exists with this phone number.");
      }

      const otp = Math.floor(1000 + Math.random() * 9000);
      const expireOtpTime = Date.now() + 1 * 60 * 1000; // OTP expires in 1 minute

      // Simulate Twilio OTP sending (commented out for now)
      // await twilioClient.messages
      //   .create({
      //     body: `Your OTP is ${otp}`,
      //     from: process.env.TWILIO_PHONE_NUMBER,
      //     to: mono,
      //   })
      //   .then(async () => {
      //     const user = await User.create({
      //       mono,
      //       name,
      //       otp,
      //       expireOtpTime,
      //     });
      //     return successResponse(res, user);
      //   })
      //   .catch((error) => {
      //     console.error("Twilio Error:", error);
      //     return res.status(500).json({ message: "Failed to send OTP." });
      //   });

      const user = await User.create({
        mono,
        name,
        otp,
        expireOtpTime,
      });

      return successResponse(res, user);
    } else {
      // If neither email nor phone number (mono) is provided
      return queryErrorRelatedResponse(req, res, 400, "Either email or phone number is required.");
    }
  } catch (error) {
    next(error);
  }
};

//Login User
const login = async (req, res, next) => {
  try {
    //Email Login

    if (req.body.email === "") {
      return queryErrorRelatedResponse(req, res, 400, "Email is required");
    }
    if (req.body.mono === "") {
      return queryErrorRelatedResponse(req, res, 400, "Phone No is required");
    }

    if (req.body.email) {
      if (!req.body.password) return queryErrorRelatedResponse(req, res, 401, "Password is required");
      const user = await User.findOne({ email: req.body.email });
      if (!user) return queryErrorRelatedResponse(req, res, 401, "Invalid User!");

      const validatePassword = await bcrypt.compare(req.body.password, user.password);
      if (!validatePassword) return queryErrorRelatedResponse(req, res, 401, "Invalid Password!");

      const token = user.generateAuthToken({ email: req.body.email });
      const refresh_token = user.generateRefreshToken({ email: req.body.email });
      const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_USER_PROFILE_PATH;
      const data = { token: token, refresh_token: refresh_token, user: user };
      successResponse(res, data, baseUrl);
    }

    //Mobile Number to Login
    else if (req.body.mono) {
      const user = await User.findOne({ mono: req.body.mono });
      if (!user) return queryErrorRelatedResponse(req, res, 401, "Invalid User!");

      var otp = Math.floor(1000 + Math.random() * 9000);
      var expireOtpTime = Date.now() + 1 * 60 * 1000; //Valid upto 5 min
      if (!req.body.mono || !otp) {
        return res.status(400).json({ message: "Phone number and OTP are required." });
      }
      // await twilioClient.messages
      //   .create({
      //     body: `Your OTP is ${otp}`,
      //     from: process.env.TWILIO_PHONE_NUMBER,
      //     to: req.body.mono,
      //   })
      //   .then(async (data) => {
      //     user.otp = otp;
      //     user.expireOtpTime = expireOtpTime;
      //     await user.save();

      //     successResponse(res, user);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
      user.otp = otp;
      user.expireOtpTime = expireOtpTime;
      await user.save();
      return successResponse(res, user);
    }

    // //Google Login
    // else if (req.body.google_id) {
    //   const user = await user.findOne({ google_id: req.body.google_id });
    //   if (!user) {
    //     const reqbody = req.body;
    //     const user = User.create({
    //       google_id: req.body.google_id,
    //       reqbody,
    //     });
    //     const token = user.generateAuthToken({ google_id: req.body.google_id });
    //     const refresh_token = user.generateRefreshToken({ google_id: req.body.google_id });
    //     const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_USER_PROFILE_PATH;
    //     const info = { token: token, refresh_token: refresh_token, user: user };
    //     successResponse(res, info, baseUrl);
    //   } else {
    //     successResponse(res, user);
    //   }
    // }

    // //Apple Login
    // else {
    //   const user = await user.findOne({ google_id: req.body.apple_id });
    //   if (!user) {
    //     const reqbody = req.body;
    //     const user = User.create({
    //       apple_id: req.body.apple_id,
    //       reqbody,
    //     });
    //     const token = user.generateAuthToken({ apple_id: req.body.apple_id });
    //     const refresh_token = user.generateRefreshToken({ apple_id: req.body.apple_id });
    //     const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_USER_PROFILE_PATH;
    //     const info = { token: token, refresh_token: refresh_token, user: user };
    //     successResponse(res, info, baseUrl);
    //   } else {
    //     successResponse(res, user);
    //   }
    // }
    else {
      return queryErrorRelatedResponse(req, res, 400, "Either email or phone number is required.");
    }
  } catch (error) {
    next(error);
  }
};

//Mobile Number Login Otp Verification
const mobaileOtpVerify = async (req, res, next) => {
  try {
    if (req.body.mono == "") {
      queryErrorRelatedResponse(req, res, 400, "Phone no is requires");
    }
    if (req.body.otp == "") {
      queryErrorRelatedResponse(req, res, 400, "Otp is requires");
    }
    const user = await User.findOne({ mono: req.body.mono, otp: req.body.otp });
    if (!user) return queryErrorRelatedResponse(req, res, 401, "Invalid Detail");

    if (user.expireOtpTime < Date.now()) {
      return res.status(401).json({ success: false, message: "OTP has expired." });
    }
    const token = user.generateAuthToken({ mono: req.body.mono });
    const refresh_token = user.generateRefreshToken({ mono: req.body.mono });
    user.otp = null;
    await user.save();
    const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_USER_PROFILE_PATH;
    const info = { token: token, refresh_token: refresh_token, user: user };
    successResponse(res, info, baseUrl);
  } catch (error) {
    next(error);
  }
};

//Add Profine
const addProfile = async (req, res, next) => {
  try {
    console.log("profile");
    console.log(req.body);
    const user = await User.findById(req.body.user_id);
    if (!user) return queryErrorRelatedResponse(req, res, 401, "Invalid User");
    if (req.body.name) {
      user.name = req.body.name;
    }
    if (req.body.diet) {
      const { diet } = req.body;
      diet.map((data) => {
        if (!user.diet.includes(data)) {
          user.diet.push(data);
        }
      });
    }
    if (req.body.allergie) {
      const { allergie } = req.body;

      allergie.map((data) => {
        if (!user.allergie.includes(data)) {
          user.allergie.push(data);
        }
      });
    }
    if (req.file && req.file.filename) {
      user.image = req.file.filename;
    } else {
      user.image = null;
    }

    await user.save();
    successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

//Forgot Password - Check Email Id
const checkEmailId = async (req, res, next) => {
  try {
    if (req.body.email === "") return queryErrorRelatedResponse(req, res, 401, "Email id required");
    const user = await User.findOne({ email: req.body.email });
    if (!user) return queryErrorRelatedResponse(req, res, 401, "Invalid email id");

    var otp = Math.floor(1000 + Math.random() * 9000);
    user.otp = otp;
    user.expireOtpTime = Date.now() + 1 * 60 * 1000; // 1 minutes expiration

    sendMail({
      from: process.env.SMTP_EMAIL,
      to: user.email,
      sub: "Dish Discover - Forgot Password",
      htmlFile: "./views/userForgetPasssword.html",
      extraData: {
        OTP: otp,
      },
    });
    await user.save();

    successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

//Verify Otp
const verifyOtp = async (req, res, next) => {
  try {
    if (!req.body.otp) return queryErrorRelatedResponse(req, res, 401, "Invalid OTP!");

    const user = await User.findOne({ _id: req.body.id });
    if (!user) return queryErrorRelatedResponse(req, res, 401, "Invalid User");

    if (user.otp !== req.body.otp) return queryErrorRelatedResponse(req, res, 401, "Invalid OTP!");
    if (user.expireOtpTime < Date.now()) {
      return queryErrorRelatedResponse(req, res, 401, "OTP is Expired!");
    }

    successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

//Reset Pssword
const resetPassword = async (req, res, next) => {
  try {
    if (req.body.newpassword === "") {
      return queryErrorRelatedResponse(req, res, 401, "Password is required");
    }
    if (req.body.confirmpassword === "") {
      return queryErrorRelatedResponse(req, res, 401, "Confirm Password is required");
    }
    if (req.body.email === "") {
      return queryErrorRelatedResponse(req, res, 401, "Email is required");
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) return queryErrorRelatedResponse(req, res, 401, "Invalid User");

    if (req.body.newpassword !== req.body.confirmpassword) {
      return queryErrorRelatedResponse(req, res, 401, "Confirm Password does not match!");
    }
    user.otp = null;
    user.password = req.body.newpassword;
    await user.save();

    successResponse(res, "Your password has been change.");
  } catch (error) {
    next(error);
  }
};

const RefreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "Access Denied. No refresh token provided." });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findOne({ _id: decoded._id });
    if (!user) {
      return queryErrorRelatedResponse(req, res, 401, "Invalid User!");
    }
    const accessToken = user.generateAuthToken({ _id: user._id });

    successResponse(res, accessToken);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const profile = await User.findOne({ _id: req.user._id });
    if (!profile) return queryErrorRelatedResponse(req, res, 401, "Invalid User");

    const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_USER_PROFILE_PATH;
    successResponse(res, profile, baseUrl);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  addProfile,
  checkEmailId,
  verifyOtp,
  mobaileOtpVerify,
  resetPassword,
  RefreshToken,
  getProfile,
};
