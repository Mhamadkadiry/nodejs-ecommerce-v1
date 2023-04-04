const { check } = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");
exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id!"),
  validationMiddleware,
];
exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category required!")
    .isLength({ min: 3 })
    .withMessage("Too short category name!")
    .isLength({ max: 32 })
    .withMessage("Too long category name!"),
  validationMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id!"),
  validationMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id!"),
  validationMiddleware,
];
