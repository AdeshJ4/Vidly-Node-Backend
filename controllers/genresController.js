const debug = require("debug")("app:startup");
const { Genre, genreValidation } = require("../models/genreModel");
const asyncHandler = require("express-async-handler");

const getGenre = asyncHandler(async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) {
    res.status(404);
    throw new Error("Genre Not Found");
  }

  res.status(200).send(genre);
});

const getGenres = asyncHandler(async (req, res) => {
  const genres = await Genre.find();
  res.status(200).send(genres);
});

const createGenre = asyncHandler(async (req, res) => {
  const { error } = genreValidation(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const genre = await Genre.create({
    name: req.body.name,
  });

  res.status(201).send(genre);
});

const updateGenre = asyncHandler(async (req, res) => {
  const { error } = genreValidation(req.body);

  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!genre) {
    res.status(404);
    throw new Error("Genre Not Found");
  }

  res.status(200).send(genre);
});

const deleteGenre = asyncHandler(async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) {
    res.status(404);
    throw new Error("Genre Not Found");
  }

  res.status(200).send(genre);
});

module.exports = {
  getGenre,
  getGenres,
  createGenre,
  updateGenre,
  deleteGenre,
};
