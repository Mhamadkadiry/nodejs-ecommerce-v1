const express = require("express");
const {
  getCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
  createCategoryValidator,
} = require("../utils/validators/categoryValidator");

const subCategoryRoute = require("./subcategoryRoute");
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../services/categoryService");

const router = express.Router();

router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .get(getCategories)
  .post(createCategoryValidator, createCategory);
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);
module.exports = router;
