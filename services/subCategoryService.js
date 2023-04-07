const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const SubCategory = require("../models/SubCategory");
const ApiError = require("../utils/apiError");

exports.setCategoryIdToBody = (req, res, next) => {
  //Nested route
  if (!req.body.category) {
    console.log("we're here");
    req.body.category = req.params.categoryId;
  }
  next();
};

// @desc  Create subcategory
// @route POST /api/v1/subcategories
// @access Private
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ data: subCategory });
});

exports.createFilterObj = (req, res, next) => {
  let filterObj = {};
  if (req.params.categoryId) filterObj = { category: req.params.categoryId };
  req.filterObj = filterObj;
  next();
};
// @desc  List of subcategories
// @route GET /api/v1/subcategories
// @access Public
exports.getSubCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const subcategories = await SubCategory.find(req.filterObj)
    .skip(skip)
    .limit(limit);
  // .populate({ path: "category", select: "name -_id" });
  res
    .status(200)
    .json({ results: subcategories.length, page, data: subcategories });
});

// @desc  Get specific subcategory by id
// @route GET /api/v1/subcategories/:id
// @access Public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subcategory = await SubCategory.findById(id);
  if (!subcategory) {
    return next(new ApiError("No subcategory found!", 404));
  }
  res.status(200).json({ data: subcategory });
});

// @desc  Update specific subcategory
// @route POST /api/v1/subcategories/:id
// @access Private
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const subcategory = await SubCategory.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true }
  );
  if (!subcategory) {
    return next(new ApiError("No subcategory found!", 404));
  }
  res.status(200).json({ data: subcategory });
});

// @desc  Delete specific subcategory
// @route Delete /api/v1/subcategories/:id
// @access Private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subcategory = await SubCategory.findOneAndDelete(id);
  if (!subcategory) {
    return next(new ApiError("No subcategory found!", 404));
  }
  res.status(204).json();
});
