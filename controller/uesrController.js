const UserModel = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const userModel = require("../model/user.model");
const { hashedPassword } = require("../PasswordUtils");
const { isAdmin } = require("../middleware/auth.middleware");

// register controller
const signUpUser = async (req, res) => {
  const { name, email, password, address, phone, answer, isAdmin } = req.body;

  // Validate required fields
  if (!name || !password || !email || !address || !answer) {
    return res
      .status(400)
      .json({ error: "One or more mandatory fields are empty" });
  }

  try {
    // Check if user with the same email already exists
    const userInDB = await UserModel.findOne({ email });
    if (userInDB) {
      return res
        .status(500)
        .json({ error: "User with this email already registered" });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10); // Adjust saltRounds as needed

    // Create a new user instance
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      address,
      phone,
      answer,
      isAdmin,
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with success message
    res
      .status(201)
      .json({ success: true, message: "User Signed up Successfully!" });
  } catch (err) {
    // Handle errors
    console.error("Error in signUpUser:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// login controller
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Please enter a valid email and password" });
  }

  try {
    const userInDB = await UserModel.findOne({ email });
    if (!userInDB) {
      return res.status(401).json({ error: "Email is not valid " });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, userInDB.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Password not match " });
    }

    // Generate JWT token
    const jwtToken = jwt.sign({ _id: userInDB._id }, JWT_SECRET);

    const userInfo = {
      _id: userInDB._id,
      email: userInDB.email,
      name: userInDB.name,
      address: userInDB.address,
      phone: userInDB.phone,
      isAdmin: userInDB.isAdmin,
    };

    res.status(200).json({ result: { token: jwtToken, user: userInfo } });
  } catch (err) {
    console.error("Error in loginUser:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// controlelr forget paassword

const forgetPassword = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body; // Correct the variable name `question` to `answer`
    if (!email || !answer || !newPassword) {
      return res
        .status(400)
        .send({ message: "Please check some fields are empty..." });
    }

    const user = await userModel.findOne({ email, answer });

    if (!user) {
      return res.status(404).send({
        message: "Incorrect Email or answer .. please check",
      });
    }

    const newPass = await hashedPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: newPass });
    res.status(200).send({
      success: true,
      message: "Password reset successfully..",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Something went wrong ...",
    });
  }
};
// fetching alll users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find(
      {},
      "name email address phone isAdmin createdAt updatedAt"
    ); // Select specific fields to return
    res.status(200).json(users);
  } catch (err) {
    console.error("Error in getAllUsers:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// chang password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
  }

  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.error("Error in changePassword:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  signUpUser,
  loginUser,
  forgetPassword,
  getAllUsers,
  changePassword,
};
