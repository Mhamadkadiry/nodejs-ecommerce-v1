const { check } = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");
exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id!"),
  validationMiddleware,
];
exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand required!")
    .isLength({ min: 2 })
    .withMessage("Too short brand name!")
    .isLength({ max: 32 })
    .withMessage("Too long brand name!"),
  validationMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id!"),
  check("name").optional(),
  validationMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id!"),
  validationMiddleware,
];
