const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "UserName is required..."],
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, "Email is required..."],
    unique: [true, "Email Address already taken"],
    minlength: 5,
    maxlength: 255
  },
  password: {
    type: String,
    required: [true, "Please add user password"],
    minlength: 5,
    maxlength: 1024  // in encoded format
  },
});

// this validate function is only for validating new user.
const validateUserRegister = (user) => {
  const joiSchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),  
    password: Joi.string().min(5).max(255).required()// original password
  });

  return joiSchema.validate(user);
};


const validateUserLogin = (user) => {
  const joiSchema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),  
    password: Joi.string().min(5).max(255).required()
  });

  return joiSchema.validate(user);
};

exports.User = mongoose.model("User", userSchema);
exports.validateUserRegister = validateUserRegister;
exports.validateUserLogin = validateUserLogin;

