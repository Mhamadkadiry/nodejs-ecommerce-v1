const express = require("express");

const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateCategory,
  deleteCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../services/subCategoryService");
const {
  getSubCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");
const router = express.Router();

router
  .route("/")
  .post(createSubCategoryValidator, createSubCategory)
  .get(getSubCategories);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);
module.exports = router;
