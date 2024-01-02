const _ = require("lodash");
const bcrypt = require("bcrypt");
const {
  User,
  validateUserRegister,
  validateUserLogin,
} = require("../models/userModel");

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

    // 1st way : using lodash library
    // pick method create an object with selective properties in this case "name", "email", "password" from "req.body" obj.
    // user = await User.create(_.pick(req.body,['name', 'email', 'password']));
    /*
      2nd way : manually assigning properties
      */
    const user = await User.create({
      name, // name: req.body.name
      email,
      password: hashedPassword,
    });

    // exclude password
    res.status(201).send({name: user.name, email: user.email});
      
      
    


    // console.log(user);
    // {  output
    //   name: 'User 1',
    //   email: 'user1@gmail.com',
    //   password: '$2b$10$lKcSCS74md/gPQnH.5kE1OZckW1rqhsaUw.C8Rk5YnLbEywavLduS',
    //   _id: new ObjectId('6593f491708585f07364b63f'),
    //   __v: 0
    // }

    // const token = user.generateToken();

    //1st way : using lodash package
    // we don't have to send password and version property back to user
    // pick method create an object with selective properties in this case "_id", "name", "email" from "user" obj.
    // here we are sending a token in header section.
    // response object also have headers
    // header() method takes two arguments : 1. header name  2. its value
    // header name must starts with 'x-anyName'
    // return res.header("x-auth-token", token).json(token);

    // return res
    //   .header("X-auth-token", token)
    //   .send(_.pick(user, ["_id", "name", "email"]));

    // res.status(201).send(user);
    /*
      2st way: manually way of mapping 
      res.status(201).send({
         name: user.name,
         email: user.email,
       });
      */
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = validateUserLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const userAvailable = await User.findOne({ email });

    console.log(userAvailable);
    /*
    -> comparing plain txt p/w with hashed p/w
    -> our hashed p/w (userAvailable.password) does include salt so when we called this compare method bcrypt is going to take that 
      salt and use that to rehash this plain txt p/w
    -> compare method return boolean value
    */
    if (userAvailable &&(await bcrypt.compare(password, userAvailable.password))) {
      // jwt.sign is used to create tokens it takes payload obj as a 1st argument and as a 2nd it takes private key.
      const token = userAvailable.generateToken();
      res.status(200).send(token);
    } else {
      // we don't have to tell user what is wrong may be email or password wrong.
      res.status(400).send("Invalid email or password");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const currentUser = async(req, res) => {
  try {
    
    // if you want all details about user(employee)
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).send(user);

    // you need only some details
    // res.status(200).json(req.user);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = { registerUser, loginUser, currentUser };
