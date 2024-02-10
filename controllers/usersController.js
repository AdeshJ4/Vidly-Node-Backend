const _ = require("lodash");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const {
  User,
  validateUserRegister,
  validateUserLogin,
} = require("../models/userModel");
const emailService = require("../utils/emailService");

const pageSize = 10;


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
    let text = `Dear ${name},

    Thank you for registering with Vidly! We are excited to welcome you to our community.
    Your account has been successfully created, and you can now enjoy the benefits of being a member. If you have any questions 
    or need assistance, feel free to reach out to our support team.
    
    Best regards,
    Vidly Team
    `;
    emailService.sendEmail(email, subject, text);

    // exclude password
    return res.status(201).send({ name: user.name, email: user.email });
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

    if (
      userAvailable &&
      (await bcrypt.compare(password, userAvailable.password))
    ) {
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

/*
    1. @desc : Get All Users
    2. @route GET : /api/users?pageNumber=1
    3. @access public
*/
const getUsers = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1; // Get the requested page (default to page 1 if not provided)
    const count = await User.countDocuments(); // Count total number of documents in the collection
    const users = await User.find()
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize).select("-password");
    return res.status(200).json({ count, users }); // Return total count along with paginated movies
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

/*
    1. @desc : Get Single User
    2. @route GET : /api/users/:id
    3. @access private
*/
const getUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).send("Invalid Employee Id");

    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).send("User Not Found");

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};


/*
    1. @desc : Get users
    2. @route GET : /api/users/search:userName
    3. @access private
*/
const getUserByName = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;

    const userName = req.params.userName;
    const regex = new RegExp(userName, "i"); // Case-insensitive regex for partial match

    // Search for movies with similar names
    const count = await User.countDocuments({ name: regex });
    const users = await User.find({ name: regex })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize).select("-password");
    return res.status(200).json({ count, users });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};






/*
    1. @desc : Update User
    2. @route UPDATE : /api/users/:id
    3. @access private
*/
const updateUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid UserId");
    }

    const { error } = validateUserRegister(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // update password logic
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = await User.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      email:req.body.email,
      password: hashedPassword
    }, {
      new: true,
    });
    if (!user)
      return res
        .status(404)
        .send(`The User with given id ${req.params.id} not found`);

    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

/*
    1. @desc : delete User
    2. @route DELETE : /api/users/:id
    3. @access private
*/
const deleteUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid UserId");
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res
        .status(404)
        .send(`The User with given id ${req.params.id} not found`);
    }

    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};



module.exports = {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  getUserByName,
  updateUser,
  deleteUser
};
