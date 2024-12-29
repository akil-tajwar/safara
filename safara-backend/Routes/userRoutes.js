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
    updateUser,
    changePassword,
    googleLogin,
    deleteMyAccount
} = require('../Controllers/userController.js');

const router = express.Router();


//post
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/googleLogin', googleLogin);
router.post("/forgetPassword", forgetPassword)
router.post("/resetPassword/:token", resetPassword)

//get
router.get('/allUsers', getAllUsers);
router.get('/allUsersCount', getAllUsersCount);
router.get('/singleUser/:id', getSingleUser);

//delete
router.delete('/deleteUser/:id', deleteUser);
router.delete('/deleteMyAccount', deleteMyAccount);

//patch
router.patch('/makeAdmin/:id', makeAdmin);
router.patch('/undoAdmin/:id', undoAdmin);
router.patch('/updateUser/:id', updateUser);
router.patch('/changePassword', changePassword);

  
module.exports = router;