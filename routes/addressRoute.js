const express = require("express");
const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} = require("../services/addressService");
const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(authService.protect, authService.allowedTo("user"), addAddress);
router
  .route("/")
  .get(
    authService.protect,
    authService.allowedTo("user"),
    getLoggedUserAddresses
  );
router.delete(
  "/:addressId",
  authService.protect,
  authService.allowedTo("user"),
  removeAddress
);
module.exports = router;
