const jwt = require("jsonwebtoken");
const UserModel = require("../model/user.model");
const { JWT_SECRET } = require("../config");

// middleware protect
const protect = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "User not logged in" });
  }

  const token = authorization.replace("JWT ", "");

  jwt.verify(token, JWT_SECRET, (error, payload) => {
    if (error) {
      return res.status(401).json({ error: "User not logged in" });
    }

    const { _id } = payload;

    UserModel.findById(_id)
      .then((dbUser) => {
        if (!dbUser) {
          return res.status(404).json({ error: "User not found" });
        }
        req.user = dbUser;

        next();
      })
      .catch((err) => {
        res.status(500).json({ error: "Internal server error" });
      });
  });
};

// middleware admin or not
const isAdmin = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (user.isAdmin) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Access is denied",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};

module.exports = { protect, isAdmin };
