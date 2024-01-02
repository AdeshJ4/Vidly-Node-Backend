const mongoose = require("mongoose");
const { genreSchema } = require("../models/genreModel");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  /* 
    -> here we are embedding genre document inside a movie document 
    -> note that we already have genre collection but mosh decided to embed genre document inside a movie document  
        to optimize performance of a query. so this is a hybrid approach.
    -> In the future we can rename genre name.
    -> you still wondering then why we need genre collection.
    -> because somewhere in our application on the client side we have a drop down list for user 
        to select genre for a movie so we still have  list of genre in one place 
    */
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    default: 0,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
});

function validateMovie(movie) {
  const joiSchema = Joi.object({
    title: Joi.string().required().min(2).max(100).trim(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().required().min(0).max(255),
    dailyRentalRate: Joi.number().required().min(0).max(100),
  });

  return joiSchema.validate(movie);
}

const Movie = mongoose.model("Movie", movieSchema);

module.exports = { Movie, validateMovie };
