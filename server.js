const express = require("express");
const dotenv = require("dotenv").config();
const debug = require("debug")("app:startup");
const helmet = require("helmet");
const morgan = require("morgan");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./dbConnection");
const config = require('config');
const app = express();

connectDB();

if(!config.get('jwtPrivateKey')){
    debug('FATAL ERROR: jwrPrivateKey id not defined');
    process.exit(1);
}

// Middlewares
app.use(express.json());
app.use(helmet());
if (process.env.NODE_ENV === "development") app.use(morgan("tiny"));
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use(errorHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => debug(`Server Listening on port ${port}`));