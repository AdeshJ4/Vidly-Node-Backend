const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const errorHandler = require("../middlewares/errorHandler");
const compression = require("compression");
const config = require("config");


module.exports = function (app) {
  app.use(express.json());
  app.use(helmet());
  app.use(compression());
  if (config.get("NODE_ENV") === "development") app.use(morgan("tiny"));
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/genres", genres);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use(errorHandler);
};
