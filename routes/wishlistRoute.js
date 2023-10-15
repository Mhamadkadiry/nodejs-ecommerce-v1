const express = require("express");
const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require("../services/wishlistService");
const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("user"),
    addProductToWishlist
  );
router
  .route("/")
  .get(
    authService.protect,
    authService.allowedTo("user"),
    getLoggedUserWishlist
  );
router.delete(
  "/:productId",
  authService.protect,
  authService.allowedTo("user"),
  removeProductFromWishlist
);
module.exports = router;
