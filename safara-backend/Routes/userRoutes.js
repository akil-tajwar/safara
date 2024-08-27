const express = require("express");
const { signupUser, loginUser, getAllUsers, deleteUser } = require('../Controllers/userController.js');

const router = express.Router();

//post
router.post('/signup',signupUser);
router.post('/login',loginUser);

//get
router.get('/allUsers',getAllUsers);

//delete
router.delete('/deleteUser/:id',deleteUser);

module.exports = router;