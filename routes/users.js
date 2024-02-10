const express = require("express");
const router = express();
const {registerUser, loginUser, currentUser, getUsers, updateUser, deleteUser, getUser} = require('../controllers/usersController');
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

router.get("/:userName", getUser)

// Update User
// router.put("/:id", updateUser);

// delete user
router.delete('/:id', deleteUser)



module.exports = router;
