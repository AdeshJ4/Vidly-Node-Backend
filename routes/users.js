const express = require("express");
const { registerUser, loginUser, currentUser } = require("../controllers/usersController");
const router = express.Router();

router.post('/login', loginUser);

router.post("/register", registerUser);

module.exports = router;
