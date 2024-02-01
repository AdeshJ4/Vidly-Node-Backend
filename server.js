const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const deBug = require("debug")("app:startUp");

require("./startup/dbConnection")();
require("./startup/config")();
require("./startup/prod")(app);
require("./startup/routes")(app);

const port = process.env.PORT || 5001;
app.listen(port, () => {
  deBug(`Server listening on port ${port}`);
});