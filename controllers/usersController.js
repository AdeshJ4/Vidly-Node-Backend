const asyncHandler = require("express-async-handler");
const _ = require("lodash");
const debug = require("debug")("app:startup");
const bcrypt = require("bcrypt");
const config = require('config');
const jwt = require("jsonwebtoken");
const {
  User,
  validateUserRegister,
  validateUserLogin,
} = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const { error } = validateUserRegister(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered");
  }

  // Hash password (plain txt) -> encoded format
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("hashed password: " + hashedPassword);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // for sending specific properties
  res.status(201).send(_.pick(user, ["_id", "name", "email"]));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { error } = validateUserLogin(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      { user: { _id: user._id, username: user.name, email: user.email } },
      config.get('jwtPrivateKey'),  // process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "5m" }
    );

    debug(`jwtPrivateKey: ${config.get("jwtPrivateKey")}`);
    res.status(201).json(accessToken);
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});


module.exports = { registerUser, loginUser, currentUser };
