const express = require("express");
const dotenv = require("dotenv").config();
const debug = require("debug")("app:startup");
const helmet = require("helmet");
const morgan = require("morgan");
const genres = require("./routes/genres");
const app = express();

// Middlewares
app.use(express.json());
app.use(helmet());
if (process.env.NODE_ENV === "development") app.use(morgan("tiny"));
app.use("/api/genres", genres);

const port = process.env.PORT || 3001;
app.listen(port, () => debug(`Server Listening on port ${port}`));
