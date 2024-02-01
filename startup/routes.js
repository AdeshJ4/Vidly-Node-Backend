const express = require("express");
const morgan = require("morgan");
const config = require("config");
const deBug = require("debug")("app:startUp");
const cors = require("cors");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");

module.exports = function (app) {
  deBug(`Application Name: ${config.get("name")}`);
  deBug(`NODE_ENV : ${config.get("NODE_ENV")}`);

  if (config.get("NODE_ENV") === "development") {
    app.use(morgan("tiny"));
    app.use(cors());
    deBug("morgan & cors enabled.");
  }

  app.use(express.json());
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
};
