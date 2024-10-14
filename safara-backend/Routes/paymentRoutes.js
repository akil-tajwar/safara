const express = require("express");
const {
    bkashCheckout,
    bkashCallback,
    bkashRefund,
    bkashSearch,
    bkashQuery
} = require("../Controllers/paymentController");

const router = express.Router();


//post
router.post('/bkashCheckout', bkashCheckout);
router.get('/bkashCallback', bkashCallback);
router.post('/bkashRefund', bkashRefund);
router.get('/bkashSearch', bkashSearch);
router.get('/bkashQuery', bkashQuery);


module.exports = router;