const helmet = require("helmet");
const compression = require("compression");
const deBug = require("debug")("app:startUp");
const config = require("config");
const cors = require("cors");

module.exports = function (app) {
  if (config.get("NODE_ENV") === "production") {
    app.use(cors());
    app.use(helmet()); // Helps secure your app by setting various HTTP Headers.
    app.use(compression()); // for performance reason, it reduce the data sent between the server and clients
    deBug("helmet, compression & cors is enabled.");
  }
};
