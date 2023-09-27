const Product = require("../models/Product");
const factory = require("./handlerFactory");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");

exports.uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);
exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  //image cover processing
  if (req.files.imageCover) {
    const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1300)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFilename}`);
    req.body.imageCover = imageCoverFilename;
  }
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img) => {
        const imageFilename = `product-${uuidv4()}-${Date.now()}.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1300)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageFilename}`);
        req.body.images.push(imageFilename);
      })
    );
  }
  next();
});
// @desc  List of products
// @route GET /api/v1/products
// @access Public
exports.getProducts = factory.getAll(Product, "Product");

// @desc  Get specific product by id
// @route GET /api/v1/products/:id
// @access Public
exports.getProduct = factory.getOne(Product, "reviews");

// @desc  Create product
// @route POST /api/v1/products
// @access Private
exports.createProduct = factory.createOne(Product);

// @desc  Update specific product
// @route POST /api/v1/products/:id
// @access Private
exports.updateProduct = factory.updateOne(Product);

// @desc  Delete specific product
// @route Delete /api/v1/products/:id
// @access Private
exports.deleteProduct = factory.deleteOne(Product);
