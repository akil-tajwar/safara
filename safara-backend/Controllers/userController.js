const mongoose = require('mongoose');
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

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSingleUser = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid ID" });
    }
    const user = await userModel.findById(id);
    if (user) {
        res.status(200).json(user);
    } else {
        return res.status(400).json({ error: "No Such user Found" });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid ID" });
    }
    const deletedUser = await userModel.findOneAndDelete({ _id: id });
    if (deletedUser) {
        res.status(200).json(deletedUser);
    } else {
        return res.status(400).json({ error: "No Such user Found" });
    }
};

const makeAdmin = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid ID." });
    }
    const { role } = req.body;
    if (!role) {
        return res.status(400).json({ error: "Role is required." });
    }
    const user = await userModel.findOneAndUpdate(
        { _id: id },
        { role : 'admin'},
        { new: true }
    );
    if (user) {
        res.status(200).json(user);
    } else {
        return res.status(400).json({ error: "No Such User Found." });
    }
};

const undoAdmin = async (req, res) => {
    const { id } = req.params;
    
    // Validate the provided ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid ID." });
    }
    
    try {
        const prevUser = await userModel.findById(id);
        const user = await userModel.findOneAndUpdate(
            { _id: id },
            { role: prevUser.prevRole },
            { new: true }
        );
        console.log("🚀 ~ undoAdmin ~ user:", user)

        if (user) {
            res.status(200).json(user);
        } else {
            return res.status(400).json({ error: "No Such User Found." });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error." });
    }
};



module.exports = {
    signupUser,
    loginUser,
    getAllUsers,
    getSingleUser,
    deleteUser,
    makeAdmin,
    undoAdmin
}