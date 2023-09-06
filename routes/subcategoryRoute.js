const express = require("express");

const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj,
} = require("../services/subCategoryService");
const {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");
const slugMiddleware = require("../middlewares/slugMiddleware");

// Mergeparams: allow us to access others params in the nested route
// example: here we want to access categoryId from category router
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    setCategoryIdToBody,
    createSubCategoryValidator,
    slugMiddleware,
    createSubCategory
  )
  .get(createFilterObj, getSubCategories);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, slugMiddleware, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);
module.exports = router;
