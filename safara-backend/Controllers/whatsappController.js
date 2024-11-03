require("dotenv").config();
const axios = require('axios');

const sendTemplateMessage = async (req, res) => {
    let resData = {
        status: false,
        answare: ''
    };

    try {
        const options = {
            method: 'POST',
            url: 'https://graph.facebook.com/v20.0/496721360182522/messages',
            headers: {
                Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: {
                messaging_product: 'whatsapp',
                to: process.env.WHATSAPP_TO,
                type: 'template',
                template: {
                    name: 'hello_world',
                    language: {
                        code: 'en_US'
                    }
                }
            }
        };

        axios(options)
            .then(response => {
                resData.status = true;
                resData.respondData = response.data;
                return res.status(200).json(resData);
            })
            .catch(error => {
                resData.status = false;
                resData.answare = error.message;
                return res.status(500).json(resData);
            });

    } catch (e) {
        resData.status = false;
        resData.answare = e.message;
        return res.status(500).json(resData);
    }
}

module.exports = {
    sendTemplateMessage,
};