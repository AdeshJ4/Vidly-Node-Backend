const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const config = require("config");
const debug = require("debug")("app:startup");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHandler = req.headers.Authorization || req.headers.authorization;
  if (!authHandler || !authHandler.startsWith("Bearer")) {
    res.status(401);
    throw new Error("user is not authorized ot token is missing");
  }
  if (authHandler && authHandler.startsWith("Bearer")) {
    token = authHandler.split(" ")[1];
    jwt.verify(token, config.get("jwtPrivateKey"), (err, decodedData) => {
      if (err) {
        debug("I am inside err validationToken");
        res.status(401);
        throw new Error("User is not authorized");
      } else {
        debug(decodedData);
        req.user = decodedData.user;
        next();
      }
    });

    if (!token) {
      res.status(401);
      throw new Error("user is not authorized ot token is missing");
    }
  }
});

module.exports = validateToken;
