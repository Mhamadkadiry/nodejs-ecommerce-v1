const Review = require("../models/Review");
const factory = require("./handlerFactory");

// GET /api/v1/producs/:productId/reviews
exports.createFilterObj = (req, res, next) => {
  //Nested route {getAll}
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  console.log("Here we go!!!!!!!!!!");
  console.log(req.filterObj);
  next();
};
exports.setProductAndUserIdToBody = (req, res, next) => {
  //Nested route {create}
  if (!req.body.product) {
    req.body.product = req.params.productId;
  }
  if (!req.body.user) {
    req.body.user = req.user._id;
  }
  next();
};
// @desc  List of reviews
// @route GET /api/v1/reviews
// @access Public
exports.getReviews = factory.getAll(Review);

// @desc  Get specific review by id
// @route GET /api/v1/reviews/:id
// @access Public
exports.getReview = factory.getOne(Review);

// @desc  Create Review
// @route POST /api/v1/Reviews
// @access Private/Protect/User
exports.createReview = factory.createOne(Review);

// @desc  Update specific Review
// @route POST /api/v1/Reviews/:id
// @access Private/Protect/User
exports.updateReview = factory.updateOne(Review);

// @desc  Delete specific Review
// @route Delete /api/v1/Reviews/:id
// @access Private/User-admin-manager
exports.deleteReview = factory.deleteOne(Review);
