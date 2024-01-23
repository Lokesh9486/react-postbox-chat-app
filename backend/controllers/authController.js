const User = require("../model/userModel");
const catchAsyncError = require("../middlewares/catchAsyncError");
const crypto = require("crypto");
const setToken = require("../utils/jwt");
const ErrorHandler = require("../utils/errorHandler");

exports.singUp = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const OTP = crypto.randomInt(100000, 1000000).toString();
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    OTP,
    OTPExpries: Date.now() + 30 * 60 * 1000,
  });
  res.status(200).json(user);
});

exports.signIn = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  console.log("email, password:", email, password)

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }
  if (!(await user.isValidPassword(password))) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }
  if (!user.IsOTPVerfied) {
    user.password = password;
    user.one = "one";
    user.OTP = crypto.randomInt(100000, 1000000).toString();
    user.OTPExpries = Date.now() + 30 * 60 * 1000;
    console.log("exports.signIn=catchAsyncError ~ user:", user);
    await user.save({
      validateBeforeSave: true,
    });

    return res.status(200).json({
      message: `Login successfully and OTP send ${email}`,
      user,
    });
  }
  return setToken(user, 200, res, "Login successfully");
});

exports.logout = (req, res, next) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpsOnly: true,
    })
    .json("logout successful");
};

exports.OTPVerification = catchAsyncError(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    next(new ErrorHandler("Plese enter email and OTP", 400));
  }
  const user = await User.findOne({ email, OTPExpries: { $gt: Date.now() } });
  if (!user) {
    return next(new ErrorHandler("Invalid user or OTP expired", 404));
  }
  if (user.OTP != otp) {
    return next(new ErrorHandler("OTP not match with user", 404));
  }
  user.IsOTPVerfied = true;
  await user.save({
    validateBeforeSave: true,
  });
 return setToken(user, 200, res, "OTP verfied successfully");
});

exports.resendOTP = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    next(new ErrorHandler("Plese enter email ", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found"));
  }
  const OTP = crypto.randomInt(100000, 1000000).toString();
  user.OTP = OTP;
  user.OTPExpries = Date.now() + 30 * 60 * 1000;
  user.IsOTPVerfied = false;
  await user.save({
    validateBeforeSave: true,
  });
  res.status(200).json(user);
});

