const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  signupUser,
  loginUser,
  getAllUsers,
  getAllUsersCount,
  deleteUser,
  getSingleUser,
  makeAdmin,
  undoAdmin,
  forgetPassword,
  resetPassword,
  updateUser,
  changePassword,
  googleLogin,
  deleteMyAccount,
} = require("../Controllers/userController.js");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 requests per window
  message: "Too many login attempts, please try again later.",
});
//post
router.post("/signup", loginLimiter, signupUser);
router.post("/login", loginUser);
router.post("/googleLogin", googleLogin);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword/:token", resetPassword);

//get
router.get("/allUsers", getAllUsers);
router.get("/allUsersCount", getAllUsersCount);
router.get("/singleUser/:id", getSingleUser);

//delete
router.delete("/deleteUser/:id", deleteUser);
router.delete("/deleteMyAccount", deleteMyAccount);

//patch
router.patch("/makeAdmin/:id", makeAdmin);
router.patch("/undoAdmin/:id", undoAdmin);
router.patch("/updateUser/:id", updateUser);
router.patch("/changePassword", changePassword);

module.exports = router;
