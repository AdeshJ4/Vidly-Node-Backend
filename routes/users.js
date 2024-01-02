const express = require("express");
const router = express();
const {registerUser, loginUser, currentUser} = require('../controllers/usersController');
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
router.get('/current', validateToken, currentUser);


module.exports = router;
