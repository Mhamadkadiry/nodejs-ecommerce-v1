const express = require("express");
const {
  signupValidator,
  loginValidator,
  resetPasswordValidator,
} = require("../utils/validators/authValidator");
const {
  signup,
  login,
  forgetPassword,
  verifyResetCode,
  resetPassword,
} = require("../services/authService");

const router = express.Router();
router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgetpassword", forgetPassword);
router.post("/verifyresetcode", verifyResetCode);
router.post("/resetpassword", resetPasswordValidator, resetPassword);

// router
//   .route("/:id")
//   .get(getUserValidator, getUser)
//   .put(
//     uploadUserImage,
//     resizeImage,
//     updateUserValidator,
//     slugMiddleware,
//     updateUser
//   )
//   .delete(deleteUserValidator, deleteUser);

module.exports = router;
