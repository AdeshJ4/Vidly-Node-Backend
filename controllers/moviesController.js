const asyncHandler = require("express-async-handler");
const { Movie, movieValidation } = require("../models/movieModel");
const { Genre } = require("../models/genreModel");
const mongoose = require("mongoose");
const debug = require("debug")("app:startup");

const getMovie = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid MovieID");
  }

  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    res.status(404);
    throw new Error("Movie Not Found");
  }
  res.status(200).send(movie);
});

const getMovies = asyncHandler(async (req, res) => {
  const movies = await Movie.find();
  res.status(200).send(movies);
});

const createMovie = asyncHandler(async (req, res) => {
  const { error } = movieValidation(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) {
    res.status(400);
    throw new Error("Invalid Genre");
  }

  const movie = await Movie.create({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  res.status(201).send(movie);
});

const updateMovie = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid MovieID");
  }

  const { error } = movieValidation(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) {
    res.status(400);
    throw new Error("Invalid Genre");
  }

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!movie) {
    res.status(404);
    throw new Error("Movie Not found");
  }

  res.status(200).send(movie);
});

const deleteMovie = asyncHandler(async (req, res) => {
  
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid MovieID");
  }
  
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie) {
    res.status(404);
    throw new Error("Movie Not Found");
  }

  res.status(200).send(movie);
});

module.exports = {
  getMovie,
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
};
