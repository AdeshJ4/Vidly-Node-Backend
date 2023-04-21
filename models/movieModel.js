const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectid = require('joi-objectid')(Joi);
const { genreSchema } = require('../models/genreModel');

const movieSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please Provide Movie Title"],
    trim: true,
    minlength: 1,
    maxlength: 50
  },
  genre: {
    type: genreSchema,
    required: [true, "Genre is Required"]
  },
  numberInStock: {
    type: Number,
    default: 0,
    min: 0,
    max: 255
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
    max: 255,
    default: 0
  }
});

function movieValidation(movie) {
  const joiSchema = Joi.object({
    title: Joi.string().min(1).max(50).required(),
    // genreId: Joi.string().required(),
    genreId: Joi.objectid().required(),
    numberInStock: Joi.number().min(0).max(255).required(),
    dailyRentalRate: Joi.number().min(0).max(255).required()
  });

  return joiSchema.validate(movie);
}

exports.Movie = mongoose.model("Movie", movieSchema);
exports.movieValidation = movieValidation;
