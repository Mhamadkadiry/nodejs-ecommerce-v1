const SubCategory = require("../models/SubCategory");
const factory = require("./handlerFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  //Nested route {create}
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

//nestes route
// GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  //Nested route {getAll}
  let filterObj = {};
  if (req.params.categoryId) filterObj = { category: req.params.categoryId };
  req.filterObj = filterObj;
  next();
};

// @desc  List of subcategories
// @route GET /api/v1/subcategories
// @access Public
exports.getSubCategories = factory.getAll(SubCategory, "SubCategory");

// @desc  Get specific subcategory by id
// @route GET /api/v1/subcategories/:id
// @access Public
exports.getSubCategory = factory.getOne(SubCategory);

// @desc  Create subcategory
// @route POST /api/v1/subcategories
// @access Private
exports.createSubCategory = factory.createOne(SubCategory);

// @desc  Update specific subcategory
// @route POST /api/v1/subcategories/:id
// @access Private
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc  Delete specific subcategory
// @route Delete /api/v1/subcategories/:id
// @access Private
exports.deleteSubCategory = factory.deleteOne(SubCategory);
