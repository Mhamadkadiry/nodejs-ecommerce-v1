const Category = require("../models/Category");
const factory = require("./handlerFactory");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${filename}`);
    req.body.image = filename;
  }
  next();
});

// @desc  List of categories
// @route GET /api/v1/categories
// @access Public
exports.getCategories = factory.getAll(Category, "Category");

// @desc  Get specific category by id
// @route GET /api/v1/categories/:id
// @access Public
exports.getCategory = factory.getOne(Category);

// @desc  Create category
// @route POST /api/v1/categories
// @access Private
exports.createCategory = factory.createOne(Category);

// @desc  Update specific category
// @route POST /api/v1/categories/:id
// @access Private
exports.updateCategory = factory.updateOne(Category);

// @desc  Delete specific category
// @route Delete /api/v1/categories/:id
// @access Private
exports.deleteCategory = factory.deleteOne(Category);
