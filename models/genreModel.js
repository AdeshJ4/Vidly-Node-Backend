const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add the genre name"],
    trim: true,
    minlength: 5,
    maxlength: 50,
  },
});

function validateGenre(genre) {
  const joiSchema = Joi.object({
    name: Joi.string().min(3).required().trim(),
  });

  return joiSchema.validate(genre);
}

const Genre = mongoose.model("Genre", genreSchema);

module.exports = { Genre, validateGenre, genreSchema };
