const express = require("express");
const router = express.Router();
const {
  singUp,
  OTPVerification,
  resendOTP,
  signIn,
  logout,
} = require("../controllers/authController");

router.route("/signup").post(singUp);

router.route("/signin").post(signIn);

router.route("/logout").get(logout);

router.route("/otpverification").post(OTPVerification);

router.route("/resendotp").post(resendOTP);



module.exports = router;
