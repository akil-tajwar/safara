const express = require("express");
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
    updateUser
} = require('../Controllers/userController.js');

const router = express.Router();


//post
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post("/forgetPassword", forgetPassword)
router.post("/resetPassword/:token", resetPassword)

//get
router.get('/allUsers', getAllUsers);
router.get('/allUsersCount', getAllUsersCount);
router.get('/singleUser/:id', getSingleUser);

//delete
router.delete('/deleteUser/:id', deleteUser);

//patch
router.patch('/makeAdmin/:id', makeAdmin);
router.patch('/undoAdmin/:id', undoAdmin);
router.patch('/updateUser/:id', updateUser);

  
module.exports = router;