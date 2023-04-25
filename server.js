const express = require("express");
const dotenv = require("dotenv").config();
const debug = require("debug")("app:startup");
const app = express();

require("./startup/dbConnection")();
require('./startup/config')();
require('./startup/prod')(app);
require('./startup/routes')(app);

const port = process.env.PORT || 3001;
app.listen(port, () => debug(`Server Listening on port ${port}`));