const bcrypt = require("bcryptjs");

const checkConfirmPasswordMiddleware = async (req, res, next) => {
  console.log("Checking if the passwords match");
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    // Send a 400 response to the client if the passwords do not match
    console.log("Passwords do not match");
    res.status(400).send("Passwords do not match");

  } else {
    // Hash the password and send the request to the next middleware
    console.log("Passwords match");
    console.log("Hashing password");
    const salt = await bcrypt.genSalt();
    req.body.password = await bcrypt.hash(password, salt);

    // Remove confirmPassword from the request body before sending the request to the next middleware
    delete req.body.confirmPassword;

    next();
  }
};

module.exports = checkConfirmPasswordMiddleware;