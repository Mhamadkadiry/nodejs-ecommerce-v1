const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Category = require("../models/Category");
const ApiError = require("../utils/apiError");
// @desc  List of categories
// @route GET /api/v1/categories
// @access Public
exports.getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const categories = await Category.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, page, data: categories });
});

// @desc  Get specific category by id
// @route GET /api/v1/categories/:id
// @access Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    // res.status(404).json({ msg: "Category Not found!" });
    return next(new ApiError("No category found!", 404));
  }
  res.status(200).json({ data: category });
});

// @desc  Create category
// @route POST /api/v1/categories
// @access Private
exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await Category.create({
    name,
    slug: slugify(name),
  }).then((category) => res.status(201).json({ data: category }));
});

// @desc  Update specific category
// @route POST /api/v1/categories/:id
// @access Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await Category.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!category) {
    return next(new ApiError("No category found!", 404));
  }
  res.status(200).json({ data: category });
});

// @desc  Delete specific category
// @route Delete /api/v1/categories/:id
// @access Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findOneAndDelete(id);
  if (!category) {
    return next(new ApiError("No category found!", 404));
  }
  res.status(204).json();
});
