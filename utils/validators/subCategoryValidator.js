const { check } = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");
exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory id!"),
  validationMiddleware,
];
exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory required!")
    .isLength({ min: 2 })
    .withMessage("Too short Subcategory name!")
    .isLength({ max: 32 })
    .withMessage("Too long Subcategory name!"),
  check("category")
    .notEmpty()
    .withMessage("Missing Category id!")
    .isMongoId()
    .withMessage("Invalid Category id!"),
  validationMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory id!"),
  check("name")
    .notEmpty()
    .withMessage("SubCategory required!")
    .isLength({ min: 2 })
    .withMessage("Too short Subcategory name!")
    .isLength({ max: 32 })
    .withMessage("Too long Subcategory name!"),
  check("category")
    .notEmpty()
    .withMessage("Missing Category id!")
    .isMongoId()
    .withMessage("Invalid Category id!"),
  validationMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory id!"),
  validationMiddleware,
];
