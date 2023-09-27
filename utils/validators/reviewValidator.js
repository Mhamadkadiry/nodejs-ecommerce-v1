const { check } = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");
const Review = require("../../models/Review");
exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id!"),
  validationMiddleware,
];
exports.createReviewValidator = [
  check("comment").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("Ratings value is required!")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating value must be between 1 to 5"),
  check("user").isMongoId().withMessage("Invalid user id!"),
  check("product")
    .isMongoId()
    .withMessage("Invalid product id!")
    .custom((val, { req }) =>
      // Check if logged user create review before
      Review.findOne({ user: req.user._id, product: req.body.product }).then(
        (review) => {
          if (review) {
            return Promise.reject(
              new Error("You already reviewed the product before!")
            );
          }
        }
      )
    ),

  validationMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id!")
    .custom((val, { req }) => {
      return Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error("Review does not exists!"));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You are not allowed to perform this action!")
          );
        }
      });
    }),
  validationMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id!")
    .custom((val, { req }) => {
      if (req.user.role === "user") {
        return Review.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(new Error("Review does not exists!"));
          }
          console.log(review.user._id);
          console.log(req.user._id);
          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("You are not allowed to perform this action!")
            );
          }
        });
      }
      return true;
    }),
  validationMiddleware,
];
