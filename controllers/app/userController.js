const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const deleteFiles = require("../../helper/deleteFiles");
const { sendMail } = require("../../helper/emailSender");
const twilio = require("twilio");
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const signup = async (req, res, next) => {
  try {
    const { email, password, name, mono } = req.body;

    if (email) {
      const user = await User.create({ email, password, name });
      return successResponse(res, user);
    } else {
      if (!mono) {
        return queryErrorRelatedResponse(req, res, 400, "Phone number is required.");
      }

      const existingUser = await User.findOne({ mono });
      if (existingUser) {
        return queryErrorRelatedResponse(req, res, 400, "User already exists with this phone number.");
      }

      const otp = Math.floor(1000 + Math.random() * 9000);
      const expireOtpTime = Date.now() + 1 * 60 * 1000; // Valid for 5 minutes

      await twilioClient.messages
        .create({
          body: `Your OTP is ${otp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: mono,
        })
        .then(async () => {
          const user = await User.create({
            mono,
            name,
            otp,
            expireOtpTime,
          });
          return successResponse(res, user);
        })
        .catch((error) => {
          console.error("Twilio Error:", error);
          return res.status(500).json({ message: "Failed to send OTP." });
        });
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    //Email Login
    if (req.body.email) {
      const user = await User.findOne({ email: req.body.email });
      if (!user) return queryErrorRelatedResponse(req, res, 401, "Invalid User!");

      const validatePassword = await bcrypt.compare(req.body.password, user.password);
      if (!validatePassword) return queryErrorRelatedResponse(req, res, 401, "Invalid Password!");

      const token = user.generateAuthToken({ email: req.body.email });
      const refresh_token = user.generateRefreshToken({ email: req.body.email });
      const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_USER_PROFILE_PATH;
      const data = { token: token, refresh_token: refresh_token, user: user, baseUrl, baseUrl };
      successResponse(res, data);
    }

    //Mobile Number to Login
    else if (req.body.mono) {
      const user = await User.findOne({ email: req.body.email });
      if (!user) return queryErrorRelatedResponse(req, res, 401, "Invalid User!");

      var otp = Math.floor(1000 + Math.random() * 9000);
      var expireOtpTime = Date.now() + 1 * 60 * 1000; //Valid upto 5 min
      if (!req.body.mono || !otp) {
        return res.status(400).json({ message: "Phone number and OTP are required." });
      }
      await twilioClient.messages
        .create({
          body: `Your OTP is ${otp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: req.body.mono,
        })
        .then(async (data) => {
          user.otp = otp;
          user.expireOtpTime = expireOtpTime;
          await user.save();

          successResponse(res, user);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    //Google Login
    else if (req.body.google_id) {
      const user = await user.findOne({ google_id: req.body.google_id });
      if (!user) {
        const reqbody = req.body;
        const user = User.create({
          google_id: req.body.google_id,
          reqbody,
        });
        const token = user.generateAuthToken({ google_id: req.body.google_id });
        const refresh_token = user.generateRefreshToken({ google_id: req.body.google_id });
        const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_USER_PROFILE_PATH;
        const info = { token: token, refresh_token: refresh_token, user: user, baseUrl, baseUrl };
        successResponse(res, info);
      } else {
        successResponse(res, user);
      }
    }

    //Apple Login
    else {
      const user = await user.findOne({ google_id: req.body.apple_id });
      if (!user) {
        const reqbody = req.body;
        const user = User.create({
          apple_id: req.body.apple_id,
          reqbody,
        });
        const token = user.generateAuthToken({ apple_id: req.body.apple_id });
        const refresh_token = user.generateRefreshToken({ apple_id: req.body.apple_id });
        const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_USER_PROFILE_PATH;
        const info = { token: token, refresh_token: refresh_token, user: user, baseUrl, baseUrl };
        successResponse(res, info);
      } else {
        successResponse(res, user);
      }
    }
  } catch (error) {
    next(error);
  }
};

const mobaileOtpVerify = async (req, res, nex) => {
  try {
    const user = await User.findOne({ mono: req.body.mono, otp: req.body.otp });
    if (!user) return queryErrorRelatedResponse(req, res, 401, "Invalid User");

    if (user.expireOtpTime < Date.now()) {
      return res.status(401).json({ success: false, message: "OTP has expired." });
    }
    const token = user.generateAuthToken({ mono: req.body.mono });
    const refresh_token = user.generateRefreshToken({ mono: req.body.mono });
    user.otp = null;
    await user.save();
    const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_USER_PROFILE_PATH;
    const info = { token: token, refresh_token: refresh_token, user: user, baseUrl, baseUrl };
    successResponse(res, info);
  } catch (error) {}
};

const addProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.user_id);
    if (!user) return queryErrorRelatedResponse(req, res, 401, "Invalid User");

    if (req.body.diet) {
      const { diet } = req.body;
      diet.map((data) => {
        user.diet.push(data);
      });
    }
    if (req.body.allergie) {
      const { allergie } = req.body;
      allergie.map((data) => {
        user.allergie.push(data);
      });
    }
    req.file.filename ? (user.image = req.file.filename) : null;
    await user.save();
    successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

//Forgot Password - Check Email Id
const checkEmailId = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return queryErrorRelatedResponse(req, res, 401, "Invalid User");

    var otp = Math.floor(1000 + Math.random() * 9000);
    user.otp = otp;
    user.expireOtpTime = Date.now() + 1 * 60 * 1000; // 5 minutes expiration

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

const verifyOtp = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.body.id, otp: req.body.otp });
    if (!user) return queryErrorRelatedResponse(req, res, 401, "Invalid Detail");

    if (user.expireOtpTime < Date.now()) {
      return queryErrorRelatedResponse(req, res, 401, "OTP is Expired!");
    }

    successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
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

const editProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return queryErrorRelatedResponse(req, res, 404, "Invalid User!");

    req.body.name ? (user.name = req.body.name) : user.name;
    if (req.body.diet) {
      const { diet } = req.body;
      user.diet = diet;
    }
    if (req.body.allergie) {
      const { allergie } = req.body;
      user.allergie = allergie;
    }

    if (req.file && req.file.filename) {
      deleteFiles("userimg/" + user.image);
      user.image = req.file.filename;
    }

    await user.save();
    successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

const updateNotifiStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) queryErrorRelatedResponse(req, res, 404, "Invalid User");

    user.notification = !user.notification;
    await user.save();
    successResponse(res, "Update Successfully");
  } catch (error) {
    next(error);
  }
};

const updateSubscribeStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) queryErrorRelatedResponse(req, res, 404, "Invalid User");

    user.issubscribe = !user.issubscribe;
    await user.save();
    successResponse(res, "Subscribe Update Successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  addProfile,
  editProfile,
  updateNotifiStatus,
  updateSubscribeStatus,
  checkEmailId,
  verifyOtp,
  mobaileOtpVerify,
  resetPassword,
};
