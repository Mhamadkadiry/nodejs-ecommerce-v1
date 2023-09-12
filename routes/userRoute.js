const express = require("express");
const {
  getUserValidator,
  deleteUserValidator,
  updateUserValidator,
  createUserValidator,
  changeUserPasswordValidator,
  changeLoggedUserPasswordValidator,
  updateLoggedUserValidator,
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
  updateLoggedUserPassword,
  updateLoggedUserProfile,
  deleteLoggedUserAccount,
} = require("../services/userService");
const slugMiddleware = require("../middlewares/slugMiddleware");
const authService = require("../services/authService");

const router = express.Router();
router.use(authService.protect);

router.route("/getprofile").get(getLoggedUserData, getUser);

router
  .route("/changemypassword")
  .put(changeLoggedUserPasswordValidator, updateLoggedUserPassword);

router
  .route("/updateprofile")
  .put(updateLoggedUserValidator, updateLoggedUserProfile);

router.route("/deleteaccount").delete(deleteLoggedUserAccount);

router.use(authService.allowedTo("admin"));

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
