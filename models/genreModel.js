const mongoose = require("mongoose");
const Joi = require("joi");

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

function genreValidation(genre) {
  const joiSchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });

  return joiSchema.validate(genre);
}

exports.Genre = mongoose.model("Genre", genreSchema);
exports.genreValidation = genreValidation;
