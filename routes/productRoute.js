const express = require("express");
const {
  getProductValidator,
  deleteProductValidator,
  updateProductValidator,
  createProductValidator,
} = require("../utils/validators/productValidator");
const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../services/productService");

const router = express.Router();

router.route("/").get(getProducts).post(createProductValidator, createProduct);
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);
module.exports = router;
