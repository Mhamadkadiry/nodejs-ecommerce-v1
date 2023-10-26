const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

const User = require("../models/User");
const { sanitizeUser } = require("../resources/sanitizeUser");

const RESET_CODE_EXPIRATION_TIME = 10; //in minutes

//   @desc signup
//   @route POST /api/v1/auth/signup
//   @access Public
exports.signup = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const token = generateToken(user._id);

  res.status(201).json({ data: sanitizeUser(user), token });
});
//   @desc Login
//   @route POST /api/v1/auth/login
//   @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Invalid credentials!", 401));
  }
  const token = generateToken(user._id);
  res.status(200).json({ data: user, token });
});
//   @desc Authentication
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("unauthenticated!", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(new ApiError("This account no longer exists!", 401));
  }
  if (!currentUser.active) {
    return next(new ApiError("This account is deactivated!", 401));
  }
  if (currentUser.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passwordChangedTimestamp > decoded.iat) {
      return next(
        new ApiError("Password has been changed, please sign in again!", 401)
      );
    }
  }
  req.user = currentUser;
  next();
});
//   @desc User premissions
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("Unauthorized!", 403));
    }
    next();
  });
//   @desc Reset password
//   @route POST /api/v1/auth/forgetpassword
//   @access Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("User doesn't exists!", 404));
  }
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  user.passwordResetCode = hashedCode;
  user.passwordResetExpire =
    Date.now() + RESET_CODE_EXPIRATION_TIME * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();
  const message = `Hi ${user.name},\nWe received a request to reset the password on your E-shop Account.\n${resetCode}\nEnter this code to complete the reset.\nThanks for helping us keep your account secure.\nE-Commerce Team.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code",
      message: message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpire = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new ApiError("There is an error while sending the email", 500));
  }
  res
    .status(200)
    .json({ status: "success", message: "Reset code sent to the email." });
});
//   @desc Verify Reset Code
//   @route POST /api/v1/auth/forgetpassword
//   @access Public
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  const hashedCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedCode,
    passwordResetExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset code invalid or expired"));
  }

  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "success",
  });
});
//   @desc Reset password
//   @route POST /api/v1/auth/resetPassword
//   @access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("Invalid email address!", 404));
  }
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }

  user.password = req.body.password;
  user.passwordChangedAt = Date.now();
  user.passwordResetCode = undefined;
  user.passwordResetExpire = undefined;
  user.passwordResetVerified = undefined;
  await user.save();

  const token = generateToken(user._id);
  res.status(200).json({ token });
});
