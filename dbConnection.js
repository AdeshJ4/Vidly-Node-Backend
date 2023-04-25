const mongoose = require("mongoose");
const debug = require("debug")("app:startup");
const config = require("config");

const connectDB = async () => {
  try {
    // const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    const connect = await mongoose.connect(config.get("DB_Connection_String"));
    debug(
      "Database Connected " + "\tHost: ",
      connect.connection.host + "\tDB_name: ",
      connect.connection.name
    );
  } catch (err) {
    debug("Database Not Connected...");
    debug("Error: ", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
