const setToken = (user, statusCode, response, message) => {
  const token = user.jsonwebtoken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: false,
  };
  console.log("token",token)
  return response
    .status(statusCode)
    .cookie("token", token, options)
    .json({ token, message });
};

module.exports = setToken;
