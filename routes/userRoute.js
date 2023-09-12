const express = require("express");
const {
  getUserValidator,
  deleteUserValidator,
  updateUserValidator,
  createUserValidator,
  changeUserPasswordValidator,
} = require("../utils/validators/userValidator");
const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
} = require("../services/userService");
const slugMiddleware = require("../middlewares/slugMiddleware");
const authService = require("../services/authService");

const router = express.Router();
router
  .route("/getprofile")
  .get(authService.protect, getLoggedUserData, getUser);

router.use(authService.protect, authService.allowedTo("admin"));

router
  .route("/changepassword/:id")
  .put(changeUserPasswordValidator, changeUserPassword);
router
  .route("/")
  .get(getUsers)
  .post(
    uploadUserImage,
    resizeImage,
    createUserValidator,
    slugMiddleware,
    createUser
  );
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    slugMiddleware,
    updateUser
  )
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
