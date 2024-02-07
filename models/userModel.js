const mongoose = require("mongoose");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email address already taken"],
    minlength: 11,
    maxlength: 100,
  },
  password: {
    type: String,
    required: [true, "Password required"],
    minlength: 5,
    maxlength: 1024, // in encoded format
  },
  isAdmin: {
    type: Boolean,
  },
});

/**
 * responsible for creating tokens
 * Encapsulating Logic of token in Mongoose Models
 * Adding a method to a Mongoose mode
 */

userSchema.methods.generateToken = function () {
  const token = jwt.sign(
    { _id: this._id, userName: this.name, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey"),
    { expiresIn: "2 days" }
  );

  return token;
};

// this validate function is only for validating new user.
function validateUserRegister(user) {
  const joiSchema = Joi.object({
    name: Joi.string().required().min(5).max(50).trim(),
    email: Joi.string().min(11).max(50).required().email(),
    /**
     * Creates a Joi object that validates password complexity.
     * When no options are specified, the following are used:
     * {
            min: 8,
            max: 26,
            lowerCase: 1,
            upperCase: 1,
            numeric: 1,
            symbol: 1,
            requirementCount: 4,
        }
     */
    password: passwordComplexity().required(),
  });

  return joiSchema.validate(user);
}

// this validate function is only for authenticating user at the time of login.
function validateUserLogin(user) {
  const joiSchema = Joi.object({
    email: Joi.string().min(11).max(255).required().email(),
    password: passwordComplexity().required(),
  });

  return joiSchema.validate(user);
}

const User = mongoose.model("User", userSchema);

module.exports = { User, validateUserRegister, validateUserLogin };
