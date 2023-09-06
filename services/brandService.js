const Brand = require("../models/Brand");
const factory = require("./handlerFactory");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${filename}`);
  req.body.image = filename;
  next();
});

// @desc  List of brands
// @route GET /api/v1/brands
// @access Public
exports.getBrands = factory.getAll(Brand, "Brand");

// @desc  Get specific brand by id
// @route GET /api/v1/brands/:id
// @access Public
exports.getBrand = factory.getOne(Brand);

// @desc  Create brand
// @route POST /api/v1/brands
// @access Private
exports.createBrand = factory.createOne(Brand);

// @desc  Update specific brand
// @route POST /api/v1/brands/:id
// @access Private
exports.updateBrand = factory.updateOne(Brand);

// @desc  Delete specific brand
// @route Delete /api/v1/brands/:id
// @access Private
exports.deleteBrand = factory.deleteOne(Brand);
