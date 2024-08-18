const userModel = require('../Models/userModel.js')
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    console.log(process.env.ACCESS_TOKEN_SECRET);
    return jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3d" });
};

const signupUser = async (req, res) => {
    const { firstname, lastname, email, phone, role, password } = req.body;
    console.log("🚀 ~ signupUser ~ req.body:", req.body)
    try {
        const user = await userModel.signup(firstname, lastname, email, phone, role, password);
        const token = createToken(user._id);
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.login(email, password);
        const token = createToken(user._id);
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

module.exports = { signupUser, loginUser }