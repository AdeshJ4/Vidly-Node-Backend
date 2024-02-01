const _ = require("lodash");
const bcrypt = require("bcrypt");
const {
  User,
  validateUserRegister,
  validateUserLogin,
} = require("../models/userModel");
const emailService = require('../utils/emailService');

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // we are validating user input data
    const { error } = validateUserRegister(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // here we want to make sure that this user is not already registered
    let userAvailable = await User.findOne({ email }); // ({email: req.body.email})
    if (userAvailable) return res.status(400).send("User Already registered");

    // hashed the password and then save into database.
    // Hash password (plain txt) -> encoded format
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name, // name: req.body.name
      email,
      password: hashedPassword,
    });

    // send email to user
    let subject = `Welcome to ${name} - Registration Successful.`;
    let text =  `Dear ${name},

    Thank you for registering with Vidly! We are excited to welcome you to our community.
    Your account has been successfully created, and you can now enjoy the benefits of being a member. If you have any questions 
    or need assistance, feel free to reach out to our support team.
    
    Best regards,
    Vidly Team
    `
    emailService.sendEmail(email, subject, text);


    // exclude password
    return res.status(201).send({name: user.name, email: user.email});
  
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = validateUserLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const userAvailable = await User.findOne({ email });

    if (userAvailable &&(await bcrypt.compare(password, userAvailable.password))) {
      // jwt.sign is used to create tokens it takes payload obj as a 1st argument and as a 2nd it takes private key.
      const token = userAvailable.generateToken();
      return res.status(200).send(token);
    } else {
      // we don't have to tell user what is wrong may be email or password wrong.
      return res.status(400).send("Invalid email or password");
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const currentUser = async(req, res) => {
  try {
    
    // if you want all details about user(employee)
    const user = await User.findById(req.user._id).select('-password');
    return res.status(200).send(user);

    // you need only some details
    // res.status(200).json(req.user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

module.exports = { registerUser, loginUser, currentUser };
