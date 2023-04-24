const asyncHandler = require("express-async-handler");
const _ = require("lodash");
const debug = require("debug")("app:startup");
const bcrypt = require("bcrypt");

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

  // for sending specific properties and once you registered you are logged in you don't have to separately log in.
  const token = user.generateAuthToken();
  res
    .header("Authorization", token)
    .send(_.pick(user, ["_id", "name", "email"]));
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
    const token = user.generateAuthToken();
    res.status(201).json(token);
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const currentUser = asyncHandler(async (req, res) => {
  // const user = await User.findById(req.user._id).select("-password"); // returned values from database. and exclude password property
  // res.status(200).send(user);
  res.status(200).json(req.user);  // returned values stored in jwt token
});

module.exports = { registerUser, loginUser, currentUser };
