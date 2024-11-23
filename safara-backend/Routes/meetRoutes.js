const express = require("express");
const { createMeet, sendSchedule } = require("../Controllers/meetControllers");
const router = express.Router();

router.post('/createMeet',createMeet)
router.post('/sendSchedule',sendSchedule)

module.exports = router;