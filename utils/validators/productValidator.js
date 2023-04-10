const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validationMiddleware");

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must Br at least 3 chars")
    .notEmpty()
    .withMessage("Product title is required!"),
  check("description")
    .notEmpty()
    .withMessage("Product description is required!")
    .isLength({ max: 2000 })
    .withMessage("Too long description!"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required!")
    .isNumeric()
    .withMessage("product quantity must be a number!"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number!"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required!")
    .isNumeric()
    .withMessage("Product price must be a number!")
    .isLength({ max: 32 })
    .withMessage("Too long price!"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("Product price after discount must be a number!")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price!");
      }
      return true;
    }),
  check("availableColors")
    .optional()
    .isArray()
    .withMessage("Available colors should be array of strings!"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required!"),
  check("category")
    .notEmpty()
    .withMessage("Product must belong to a specific category!")
    .isMongoId()
    .withMessage("Invalid ID format"),
  check("subcateogry").optional().isMongoId().withMessage("Invalid ID format"),
  check("brand").optional().isMongoId().withMessage("Invalid ID format!"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Rating must be a number!")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0!")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0!"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number!"),

  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Ivalid product ID!"),
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Ivalid product ID!"),
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Ivalid product ID!"),
];
