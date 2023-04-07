const express = require("express");
const {
  getBrandValidator,
  deleteBrandValidator,
  updateBrandValidator,
  createBrandValidator,
} = require("../utils/validators/brandValidator");
const {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
} = require("../services/brandService");

const router = express.Router();

router.route("/").get(getBrands).post(createBrandValidator, createBrand);
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);
module.exports = router;
