const helmet = require("helmet");
const compression = require("compression");
const deBug = require("debug")("app:startUp");
const config = require("config");

module.exports = function (app) {
  if (config.get("NODE_ENV") === "production") {
    app.use(helmet());
    app.use(compression());
    deBug("helmet and compression is enabled.");
  }
};
