const mongoose = require("mongoose");
const debug = require("debug")("app:db");
const config = require("config");

// original code

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(config.get("Db_Connection_String"));
    debug("Database is Connected");
    debug("Host : ", connect.connection.host);
    debug("DB Name : ", connect.connection.name);
  } catch (err) {
    debug("Database is not connected.");
    debug("Error: ", err.message);
    process.exit(1);
  }
};
module.exports = connectDB;