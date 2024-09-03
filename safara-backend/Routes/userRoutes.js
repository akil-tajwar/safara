const express = require("express");
const {
    signupUser,
    loginUser,
    getAllUsers,
    deleteUser,
    getSingleUser,
    makeAdmin,
    undoAdmin, 
    forgetPassword,
    resetPassword
} = require('../Controllers/userController.js');

const router = express.Router();

//post
router.post('/signup', signupUser);
router.post('/login', loginUser);

//get
router.get('/allUsers', getAllUsers);
router.get('/singleUser/:id', getSingleUser);

//delete
router.delete('/deleteUser/:id', deleteUser);

//patch
router.patch('/makeAdmin/:id', makeAdmin);
router.patch('/undoAdmin/:id', undoAdmin);

// forget Password

router.post("/forgetPassword", forgetPassword)

// reset password 

router.post("/resetPassword/:token", resetPassword)
  
module.exports = router;