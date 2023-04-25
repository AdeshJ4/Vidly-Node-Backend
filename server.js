const express = require("express");
const dotenv = require("dotenv").config();
const debug = require("debug")("app:startup");
const app = express();

require("./startup/dbConnection")(); // connectDB();
require('./startup/config')();
require('./startup/routes')(app);

const port = process.env.PORT || 3001;
app.listen(port, () => debug(`Server Listening on port ${port}`));