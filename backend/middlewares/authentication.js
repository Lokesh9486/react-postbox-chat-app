const User = require("../model/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");

exports.isAuthenticateUser = catchAsyncError(async (req, res, next) => {
  // const { token } = req.cookies;
  const [,token]=req.headers['authorization'].split(' ');
  // console.log("exports.isAuthenticateUser=catchAsyncError ~ token:", token)
  if (!token) {
    return next(new ErrorHandler("Login to handle resource ", 401));
  }
  const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(id);
  if (!req.user) {
    return next(new ErrorHandler("Login to handle resource ", 401));
  }
  next();
});
