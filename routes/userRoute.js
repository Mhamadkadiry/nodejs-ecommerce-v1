const express = require("express");
const {
  getUserValidator,
  deleteUserValidator,
  updateUserValidator,
  createUserValidator,
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
} = require("../services/userService");
const slugMiddleware = require("../middlewares/slugMiddleware");

const router = express.Router();
router.put("/changepassword/:id", changeUserPassword);
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
