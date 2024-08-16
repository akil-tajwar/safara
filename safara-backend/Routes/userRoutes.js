const express = require("express");
const { signupUser } = require('../Controllers/userController.js');

const router = express.Router();

router.post('/signup',signupUser);

module.exports = router;