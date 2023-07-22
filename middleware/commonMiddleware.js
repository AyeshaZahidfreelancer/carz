const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// generate token after login
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "120h",
    }
  );
};

const errorFormatter = ({ msg }) => {
  // Build the resulting errors however we want! String, object, whatever - it works!
  return `${msg}`;
};

const expressValidatorError = (req) => {
  const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    console.log(result.array()[0]);
    throw new Error(result.array());
  }
};

module.exports = {
  generateToken,
  expressValidatorError,
};
