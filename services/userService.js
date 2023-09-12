const User = require("../models/User");
const factory = require("./handlerFactory");
const ApiError = require("../utils/apiError");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const generateToken = require("../utils/generateToken");

exports.uploadUserImage = uploadSingleImage("profileImg");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);
    req.body.profileImg = filename;
  }
  next();
});

// @desc  List of users
// @route GET /api/v1/users
// @access Private
exports.getUsers = factory.getAll(User, "User");

// @desc  Get specific user by id
// @route GET /api/v1/users/:id
// @access Private
exports.getUser = factory.getOne(User);

// @desc  Create user
// @route POST /api/v1/users
// @access Private
exports.createUser = factory.createOne(User);

// @desc  Update specific user
// @route POST /api/v1/users/:id
// @access Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError("No model found!", 404));
  }
  res.status(200).json({ data: document });
});

// @desc  updade user password
// @route PUT /api/v1/users/:id
// @access Private
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError("No model found!", 404));
  }
  res.status(200).json({ data: document });
});

// @desc  Delete specific user
// @route Delete /api/v1/users/:id
// @access Private
exports.deleteUser = factory.deleteOne(User, "user");

// @desc  Get logged user data
// @route GET /api/v1/users/myprofile
// @access Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});
// @desc  Update logged user password
// @route GET /api/v1/users/updatemypassword
// @access Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  const token = generateToken(user._id);

  res.status(200).json({ data: user, token });
});
// @desc  Update logged user data
// @route GET /api/v1/users/updateprofile
// @access Private/Protect
exports.updateLoggedUserProfile = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );

  res.status(200).json({ data: updatedUser });
});

// @desc  Deactivate logged user
// @route DELETE /api/v1/users/deleteaccount
// @access Private/Protect
exports.deleteLoggedUserAccount = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    active: false,
  });

  res.status(204).json({ status: "success" });
});
