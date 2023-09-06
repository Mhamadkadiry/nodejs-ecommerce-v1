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
  uploadBrandImage,
  resizeImage,
} = require("../services/brandService");
const slugMiddleware = require("../middlewares/slugMiddleware");

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    slugMiddleware,
    createBrand
  );
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    slugMiddleware,
    updateBrand
  )
  .delete(deleteBrandValidator, deleteBrand);
module.exports = router;
