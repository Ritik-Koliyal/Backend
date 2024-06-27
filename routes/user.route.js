const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/auth.middleware");
const {
  signUpUser,
  loginUser,
  forgetPassword,
  getAllUsers,
  changePassword,
} = require("../controller/uesrController");

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/forgetPassword", forgetPassword);
router.get("/verify-user", protect, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get("/verify-admin", protect, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

router.get("/allusers", protect, isAdmin, getAllUsers);
router.put("/changepassword", protect, changePassword);
module.exports = router;
