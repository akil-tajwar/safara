require('dotenv').config();
const mongoose = require("mongoose");
const courseModel = require("../Models/courseModel.js");
const { createPayment, executePayment, queryPayment, searchTransaction, refundTransaction } = require('bkash-payment')

const bkashConfig = {
    base_url: process.env.BKASH_BASE_URL,
    username: process.env.BKASH_USERNAME,
    password: process.env.BKASH_PASSWORD,
    app_key: process.env.BKASH_APP_KEY,
    app_secret: process.env.BKASH_APP_SECRET
};

const bkashCheckout = async (req, res) => {
    try {
        const { amount, callbackURL, orderID, reference } = req.body
        const paymentDetails = {
            amount: amount || 1,                                                 // your product price
            callbackURL: callbackURL ,  // your callback route
            orderID: orderID || 'Order_101',                                     // your orderID
            reference: reference || '1'                                          // your reference
        }
        const result = await createPayment(bkashConfig, paymentDetails)
        res.status(200).send(result?.bkashURL)
    } catch (e) {
        console.log(e)
    }
}

const bkashCallback = async (req, res) => {
    try {
        const { status, paymentID } = req.query
        let result
        let response = {
            statusCode: '4000',
            statusMessage: 'Payment Failed'
        }
        if (status === 'success') result = await executePayment(bkashConfig, paymentID)

        if (result?.transactionStatus === 'Completed') {
            // payment success
            // insert result in your db
        }
        if (result) response = {
            statusCode: result?.statusCode,
            statusMessage: result?.statusMessage
        }
        // You may use here WebSocket, server-sent events, or other methods to notify your client
        res.send(response)
    } catch (e) {
        console.log(e)
    }
}

const bkashRefund = async (req, res) => {
    try {
        const { paymentID, trxID, amount } = req.body
        const refundDetails = {
            paymentID,
            trxID,
            amount,
        }
        const result = await refundTransaction(bkashConfig, refundDetails)
        res.send(result)
    } catch (e) {
        console.log(e)
    }
}

const bkashSearch = async (req, res) => {
    try {
        const { trxID } = req.query
        const result = await searchTransaction(bkashConfig, trxID)
        res.send(result)
    } catch (e) {
        console.log(e)
    }
}

const bkashQuery = async (req, res) => {
    try {
        const { paymentID } = req.query
        const result = await queryPayment(bkashConfig, paymentID)
        res.send(result)
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    bkashCheckout,
    bkashCallback,
    bkashRefund,
    bkashSearch,
    bkashQuery
};