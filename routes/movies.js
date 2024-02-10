const express = require("express");
const router = express();
const validateAdmin = require("../middlewares/validateAdmin");
const validateToken = require("../middlewares/validateTokenHandler");
const {
  getMovie,
  getMovies,
  getMoviesByGenre,
  createMovie,
  updateMovie,
  deleteMovie,
  getMoviesBySearch,
} = require("../controllers/movieController");

// get a movies
router.get("/", getMovies);

// get a movie
router.get("/:id", getMovie);

// get movies according to genre
router.get("/genre/:genre", getMoviesByGenre);

// get movies according to search
    router.get("/search/:movieName", getMoviesBySearch);

// create a movie
router.post("/", validateToken, createMovie);

// update a movie
router.put("/:id", validateToken, updateMovie);

// delete a movie
// to delete a movie you must be a admin and not a normal employee
router.delete("/:id", [validateToken, validateAdmin], deleteMovie);

module.exports = router;
