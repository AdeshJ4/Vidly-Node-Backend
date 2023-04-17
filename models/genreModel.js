const mongoose = require("mongoose");

const genreSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add the genre name"],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Genre", genreSchema);
