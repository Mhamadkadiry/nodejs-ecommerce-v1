const express = require("express");

const {
  getReviewValidator,
  deleteReviewValidator,
  updateReviewValidator,
  createReviewValidator,
} = require("../utils/validators/reviewValidator");
const {
  getReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setProductAndUserIdToBody,
} = require("../services/reviewService");
const authService = require("../services/authService");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObj, getReviews)
  .post(
    authService.protect,
    authService.allowedTo("user"),
    setProductAndUserIdToBody,
    createReviewValidator,
    createReview
  );
router
  .route("/:id")
  .get(getReview)
  .put(
    authService.protect,
    authService.allowedTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    authService.protect,
    authService.allowedTo("user", "manager", "admin"),
    deleteReviewValidator,
    deleteReview
  );
module.exports = router;
