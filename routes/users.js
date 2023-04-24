const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
} = require("../controllers/usersController");
const router = express.Router();

const validateToken = require("../middlewares/validateTokenHandler");

router.post("/login", loginUser);

router.post("/register", registerUser);

router.get("/current", validateToken, currentUser);

module.exports = router;
