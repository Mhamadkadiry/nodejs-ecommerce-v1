const express = require("express");

const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateCategory,
  deleteCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj,
} = require("../services/subCategoryService");
const {
  getSubCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

// Mergeparams: allow us to access others params in the nested route
// example: here we want to access categoryId from category router
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory)
  .get(createFilterObj, getSubCategories);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);
module.exports = router;
