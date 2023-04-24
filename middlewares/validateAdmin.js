const asyncHandler = require("express-async-handler");

const isAdmin = asyncHandler((req, res, next) => {
  if (!req.user.isAdmin) {
    res.status(403);
    throw new Error("Access Denied");
  }

  next();
});

module.exports = isAdmin;
