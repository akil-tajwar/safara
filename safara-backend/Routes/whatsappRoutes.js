const express = require("express");
const { sendTemplateMessage } = require("../Controllers/whatsappController");

const router = express.Router();

//get
router.get('/sendTemplateMessage', sendTemplateMessage);

module.exports = router;