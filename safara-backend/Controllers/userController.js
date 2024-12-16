const mongoose = require("mongoose");
const userModel = require("../Models/userModel.js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const DeviceDetector = require("device-detector-js");
const deviceDetector = new DeviceDetector();

// nodemailer welcome message
const transporter = nodemailer.createTransport({
  service: "gmail", // or another email service
  auth: {
    user: "ammaraslam7164@gmail.com",
    pass: "wefopxlsdumlohpx",
  },
});

// Send welcome email function
const sendWelcomeEmail = (userEmail, userName) => {
  const mailOptions = {
    from: "ammaraslam7164@gmail.com", // sender's email
    to: userEmail, // receiver's email
    subject: "Welcome to Our Website!",
    html: `
      <h2>Hello ${userName},</h2>
      <p>Welcome to our website! We are excited to have you on board.</p>
      <p>Feel free to explore and let us know if you need any help.</p>
      <p>Best regards,<br/>Safara Academy</p>
    `,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const createToken = (_id) => {
  console.log(process.env.ACCESS_TOKEN_SECRET);
  return jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3d",
  });
};

const signupUser = async (req, res) => {
  const { firstname, lastname, email, phone, role, prevRole, img, password } =
    req.body;
  console.log("🚀 ~ signupUser ~ req.body:", req.body);
  try {
    const user = await userModel.signup(
      firstname,
      lastname,
      email,
      phone,
      role,
      prevRole,
      img,
      password
    );
    const token = createToken(user._id);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, role, prevRole, img } = req.body;

    if (!email) {
      console.error("Missing email in request body:", req.body);
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if user exists
    let user = await userModel.findOne({ email });
    let isNewUser = false;

    if (!user) {
      // Create new user if doesn't exist
      isNewUser = true;
      user = await userModel.create({
        firstname,
        lastname,
        email,
        phone,
        role,
        prevRole,
        img,
      });
    }

    // Generate token
    const token = createToken(user._id);

    // Return user data and token
    res.status(200).json({
      user: {
        ...user.toObject(),
        isNewUser
      },
      token
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(400).json({ error: error.message });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.login(email, password);
    // Detect the device type

    const token = createToken(user._id);
    if (user && token) {
      sendWelcomeEmail(email, user.firstname);
    }
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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
    { role: "admin" },
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
    console.log("🚀 ~ undoAdmin ~ user:", user);

    if (user) {
      res.status(200).json(user);
    } else {
      return res.status(400).json({ error: "No Such User Found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID" });
  }

  try {
    const updatedUser = await userModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// forget password

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.json({ message: "user not registered" });
  }
  const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "5m",
  });
  console.log(token);

  var transporter = nodemailer.createTransport({
    auth: {
      user: "ammaraslam7164@gmail.com",
      pass: "wefopxlsdumlohpx",
    },
  });

  var mailOptions = {
    from: "ammaraslam7164@gmail.com",
    to: email,
    subject: "Sending Email for reset password",
    text: `http://localhost:5173/resetPassword/${token}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send({ status: false, message: "error sending mail" });
    } else {
      console.log("Email sent: " + info.response);
      res.send({ status: true, message: "successfully sent!!" });
    }
  });
};

// reset password

const resetPassword = async (req, res) => {
  const { token } = req.params;

  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const id = decoded.id;
    const hashPassword = await bcrypt.hash(password, 10);

    await userModel.findByIdAndUpdate({ _id: id }, { password: hashPassword });

    return res.json({ status: true, message: "successfully reset!" });
  } catch (err) {
    console.log(err);

    res.send({ status: false, message: "Something went wrong!" });
  }
};
// user count
const getAllUsersCount = async (req, res) => {
  const usersCount = await userModel.estimatedDocumentCount();
  res.send({ usersCount });
};

// Change Password API
const changePassword = async (req, res) => {
  console.log("change password api hitted");
  const { oldPassword, newPassword, retypePassword, id } = req.body;
  const userId = id;
  console.log(oldPassword, newPassword);

  // Validate input fields
  if (!oldPassword || !newPassword || !retypePassword) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (newPassword !== retypePassword) {
    return res
      .status(400)
      .json({ error: "New password and confirmation do not match." });
  }

  // Get the authenticated user's ID (replace with your authentication logic)

  console.log("id", userId);

  // Find user by ID
  const user = await userModel.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  // Check if the old password is correct
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Old password is incorrect." });
  }

  // Hash the new password

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password
  user.password = hashedPassword;
  await user.save();

  res.status(200).json({ message: "Password updated successfully." });
};

// Google Login Route
// const googleLogin = async (req, res) => {
//   const { email, firstname, lastname, img } = req.body;

//   // Ensure required fields are present
//   if (!email || !firstname || !lastname) {
//     return res
//       .status(400)
//       .json({ error: "Email, firstname, and lastname are required." });
//   }

//   try {
//     // Check if the user already exists
//     let googleUser = await userModel.findOne({ email });

//     if (googleUser) {
//       // Generate a token for the existing user
//       const token = createToken(googleUser._id);
      
//       // Optional: Send a welcome email only on the first login if needed
//       sendWelcomeEmail(email, googleUser.firstname);

//       return res.status(200).json({
//         message: "User logged in successfully.",
//         newUser: false,
//         user: googleUser,
//         token,
//       });
//     }

//     // Create a new user if not found
//     googleUser = new userModel({
//       email,
//       firstname,
//       lastname,
//       img: img || "", // Default to an empty string if no image provided
//       phone: "N/A",   // Placeholder for phone
//       role: "user",   // Default role
//       prevRole: "user", // To maintain role history
//     });

//     await googleUser.save();

//     // Generate a token for the new user
//     const token = createToken(googleUser._id);

//     // Send a welcome email to the new user
//     sendWelcomeEmail(email, firstname);

//     return res.status(201).json({
//       message: "New user created successfully.",
//       newUser: true,
//       user: googleUser,
//       token,
//     });
//   } catch (error) {
//     console.error("Error during Google login:", error);
//     return res.status(500).json({ error: "Server error. Please try again." });
//   }
// };

module.exports = {
  signupUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  makeAdmin,
  undoAdmin,
  forgetPassword,
  resetPassword,
  getAllUsersCount,
  changePassword,
  googleLogin,
};
