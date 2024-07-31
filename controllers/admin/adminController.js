const { successResponse, queryErrorRelatedResponse, createResponse } = require("../../helper/sendResponse");
const Admin = require("../../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const deleteFiles = require("../../helper/deleteFiles");

// Admin Register
const Register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const admin = await Admin.create({
      name: name,
      email: email,
      password: password,
      image: req.file.filename,
    });
    createResponse(res, admin);
  } catch (error) {
    next(error);
  }
};

//Admin Login
const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: email });
    if (!admin) return queryErrorRelatedResponse(req, res, 401, "Invalid User!");

    const validatePassword = await bcrypt.compare(password, admin.password);
    if (!validatePassword) return queryErrorRelatedResponse(req, res, 401, "Invalid Password!");

    const token = admin.generateAuthToken({ email: req.body.email });
    admin.accessToken = token;
    const refresh_token = admin.generateRefreshToken({ email: req.body.email });
    const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_ADMIN_PROFILE_PATH;
    const respo = await admin.save();
    const data = { token: token, refresh_token: refresh_token, admin: admin, baseUrl, baseUrl };
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

//Get RefreshToken
const RefreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "Access Denied. No refresh token provided." });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const admin = await Admin.findOne({ email: decoded.email });
    if (!admin) {
      return queryErrorRelatedResponse(req, res, 401, "Invalid User!");
    }
    const accessToken = admin.generateAuthToken({ email: admin.email });
    successResponse(res, accessToken);
  } catch (error) {
    next(error);
  }
};

//Admin Reset Password
const ResetPassword = async (req, res, next) => {
  try {
    const { oldpssword, newpassword, confirmpassword } = req.body;
    const admin = await Admin.findOne({ email: req.admin.email });
    if (!admin) return queryErrorRelatedResponse(req, res, 404, "Invalid User!");

    const varifyPassword = await bcrypt.compare(oldpssword, admin.password);
    if (!varifyPassword) return queryErrorRelatedResponse(req, res, 401, "Invalid Old Password");

    if (newpassword !== confirmpassword) {
      return queryErrorRelatedResponse(req, res, 401, { confirm_password: "Confirm Password does not match!" });
    }

    admin.password = newpassword;
    await admin.save();
    successResponse(res, "Password changed successfully!");
  } catch (error) {
    next(error);
  }
};

//Update Admin Profile
const updateProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ email: req.admin.email });
    if (!admin) return queryErrorRelatedResponse(req, res, 401, "Invalid Admin!");

    admin.name = req.body.name;
    if (req.file && req.file.filename) {
      deleteFiles("adminimg/" + admin.image);
      admin.image = req.file.filename;
    }

    const data = await admin.save();
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

module.exports = { Register, Login, RefreshToken, ResetPassword, updateProfile };
