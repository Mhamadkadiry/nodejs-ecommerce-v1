const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Brand = require("../models/Brand");
const ApiError = require("../utils/apiError");
// @desc  List of brands
// @route GET /api/v1/brands
// @access Public
exports.getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const brands = await Brand.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: brands.length, page, data: brands });
});

// @desc  Get specific brand by id
// @route GET /api/v1/brands/:id
// @access Public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) {
    // res.status(404).json({ msg: "Brand Not found!" });
    return next(new ApiError("No brand found!", 404));
  }
  res.status(200).json({ data: brand });
});

// @desc  Create brand
// @route POST /api/v1/brands
// @access Private
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await Brand.create({
    name,
    slug: slugify(name),
  }).then((brand) => res.status(201).json({ data: brand }));
});

// @desc  Update specific brand
// @route POST /api/v1/brands/:id
// @access Private
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const brand = await Brand.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!brand) {
    return next(new ApiError("No brand found!", 404));
  }
  res.status(200).json({ data: brand });
});

// @desc  Delete specific brand
// @route Delete /api/v1/brands/:id
// @access Private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findOneAndDelete(id);
  if (!brand) {
    return next(new ApiError("No brand found!", 404));
  }
  res.status(204).json();
});
