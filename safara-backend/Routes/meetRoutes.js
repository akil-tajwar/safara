const express = require("express");
const { createMeet } = require("../Controllers/meetControllers");
const router = express.Router();



router.post('/createMeet',createMeet)


module.exports = router;