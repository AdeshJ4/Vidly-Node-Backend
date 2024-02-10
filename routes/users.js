const express = require("express");
const router = express();
const {registerUser, loginUser, getUser, getUsers, updateUser, deleteUser, getUserByName} = require('../controllers/usersController');
const validateToken = require('../middlewares/validateTokenHandler');
/**
 * -> Vidly is application that runs locally in video store.
 * -> The peoples who used this application are the peoples which works at the store.
 * -> we don't need to verify their address.
 * -> users here represents employees who works at this store
 */


// register
router.post("/register", registerUser);

// login - authentication
router.post("/login", loginUser);

// current user 
// router.get('/current', validateToken, currentUser);

// get all users/employees
router.get("/", getUsers);

// get user by id
// get a movie
router.get("/:id", getUser);

// get user by username
router.get("/search/:userName", getUserByName);

// Update User
// router.put("/:id", updateUser);

// delete user
router.delete('/:id', deleteUser)



module.exports = router;
