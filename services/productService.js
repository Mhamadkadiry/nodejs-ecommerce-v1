const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const ApiError = require("../utils/apiError");
// @desc  List of products
// @route GET /api/v1/products
// @access Public
exports.getProducts = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const products = await Product.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: products.length, page, data: products });
});

// @desc  Get specific product by id
// @route GET /api/v1/products/:id
// @access Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return next(new ApiError("No product found!", 404));
  }
  res.status(200).json({ data: product });
});

// @desc  Create product
// @route POST /api/v1/products
// @access Private
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await Product.create(req.body).then((product) =>
    res.status(201).json({ data: product })
  );
});

// @desc  Update specific product
// @route POST /api/v1/products/:id
// @access Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  req.body.slug = slugify(req.body.title);
  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!product) {
    return next(new ApiError("No product found!", 404));
  }
  res.status(200).json({ data: product });
});

// @desc  Delete specific product
// @route Delete /api/v1/products/:id
// @access Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findOneAndDelete(id);
  if (!product) {
    return next(new ApiError("No product found!", 404));
  }
  res.status(204).json();
});
