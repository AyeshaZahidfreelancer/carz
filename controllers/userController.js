const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const {
  generateToken,
  expressValidatorError,
} = require("../middleware/commonMiddleware");
const { Users, validateUser } = require("../models/users");

// @desc Authenticate a user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  //validate param data
  expressValidatorError(req);

  try {
    //check user email verification
    const user = await Users.findOne({
      where: {
        [Op.and]: [{ email: req.body.email }],
      },
    });
    if (!user) {
      res.status(400);
      throw new Error("No user found!");
    }

    //check password and give token
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      return res.status(200).send({
        token: generateToken(user),
      });
    } else {
      res.status(400);
      throw new Error("Invalid credentials or user not found.");
    }
  } catch (error) {
    //error handling
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${res.statusCode !== 400 ? "Something went wrong during login: " : ""}${
        error.message
      }`
    );
  }
});

// @desc Create new user
// @route POST /api/users
// @access Private
const createUser = asyncHandler(async (req, res) => {
  //validate param data
  expressValidatorError(req);

  const user = req.body;

  //validate user
  if (user) {
    const { error } = validateUser(user);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
  }

  try {
    //check if user exist
    const userExists = await findUser(user.email);
    if (userExists) {
      res.status(400);
      throw new Error("User already exists with same email address");
    }

    // generate password
    const randomPass = generateRandomPassword(15);

    //encrypt password
    const salt = await bcrypt.genSalt(10);
    const encryptPass = await bcrypt.hash(randomPass, salt);
    user.password = encryptPass;

    //create user
    const result = await userCreation(user);
    if (!result) {
      res.status(400);
      throw new Error("User could not be created!");
    }

    //now send the mail with randomly generated password
    user.password = randomPass;
    sendEmail(user);

    return res.status(200).send({ message: "User created successfully!" });
  } catch (error) {
    //error handling
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400 ? "Something went wrong in user creation: " : ""
      }${error.message}`
    );
  }
});

// @desc get logedin user
// @route GET /api/users/
// @access Private
const getUser = asyncHandler(async (req, res) => {
  res.json(req.result);
});

//------------------------Helper functions--------------------------
// find user with email address
function findUser(email) {
  return Users.findOne({
    where: { email: email },
  })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
}

// create user
async function userCreation(userDetail) {
  try {
    const result = await Users.create(userDetail);
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

//send mail with randomly generated password
const sendEmail = (recipient) => {
  //create a transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  //recipient information
  const mailOptions = {
    from: "your_email@gmail.com",
    to: recipient.email,
    subject: `Welcome to Carz`,
    text: `Hello ${recipient.full_name}, you have recently registered to our system, here is your Password: ${recipient.password}.`,
  };

  //send mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

//generate random password with a specific length
function generateRandomPassword(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomBytes = crypto.randomBytes(length);
  let password = "";

  for (let i = 0; i < length; i++) {
    const index = randomBytes[i] % characters.length;
    password += characters.charAt(index);
  }

  return password;
}

module.exports = {
  createUser,
  loginUser,
  getUser,
};
