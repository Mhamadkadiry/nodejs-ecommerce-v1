const { check } = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");
const User = require("../../models/User");

exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required!")
    .isLength({ min: 3 })
    .withMessage("Too short User name!")
    .isLength({ max: 22 })
    .withMessage("Too long user name!"),
  check("email")
    .notEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Invalid Email Address!")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already exists!"));
        }
      })
    ),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confiramtion is required!"),

  check("password")
    .notEmpty()
    .withMessage("Password is required!")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters!")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password and password confirmation doesn't match!");
      }
      return true;
    }),

  validationMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Invalid Email Address!"),

  check("password")
    .notEmpty()
    .withMessage("Password is required!")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters!"),
  validationMiddleware,
];

exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required!")
    .isLength({ min: 3 })
    .withMessage("Too short User name!")
    .isLength({ max: 22 })
    .withMessage("Too long user name!"),
  check("email")
    .notEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Invalid Email Address!")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already exists!"));
        }
      })
    ),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confiramtion is required!"),

  check("password")
    .notEmpty()
    .withMessage("Password is required!")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters!")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password and password confirmation doesn't match!");
      }
      return true;
    }),

  validationMiddleware,
];

exports.resetPasswordValidator = [
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation is required!"),
  check("password")
    .notEmpty()
    .withMessage("New password is required!")
    .custom(async (val, { req }) => {
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password and password confirmation doesn't match!");
      }
      return true;
    }),
  validationMiddleware,
];
