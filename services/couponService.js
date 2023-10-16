const Coupon = require("../models/Coupon");
const factory = require("./handlerFactory");

// @desc  List of Coupons
// @route GET /api/v1/Coupons
// @access Private/Admin-manager
exports.getCoupons = factory.getAll(Coupon, "Coupon");

// @desc  Get specific Coupon by id
// @route GET /api/v1/Coupons/:id
// @access Private/Admin-manager
exports.getCoupon = factory.getOne(Coupon);

// @desc  Create Coupon
// @route POST /api/v1/Coupons
// @access Private/Admin-manager
exports.createCoupon = factory.createOne(Coupon);

// @desc  Update specific Coupon
// @route POST /api/v1/Coupons/:id
// @access Private/Admin-manager
exports.updateCoupon = factory.updateOne(Coupon);

// @desc  Delete specific Coupon
// @route Delete /api/v1/Coupons/:id
// @access Private/Admin-manager
exports.deleteCoupon = factory.deleteOne(Coupon);
