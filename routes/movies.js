const express = require("express");
const router = express();
const validateAdmin = require('../middlewares/validateAdmin')
const validateToken = require('../middlewares/validateTokenHandler')
const {getMovie, getMovies, createMovie, updateMovie, deleteMovie} = require('../controllers/movieController');

// get a movies
router.get("/", getMovies);

// get a movie
router.get("/:id", getMovie);

// create a movie
router.post("/", validateToken, createMovie);

// update a movie
router.put("/:id", validateToken, updateMovie);

// delete a movie
// to delete a movie you must be a admin and not a normal employee
router.delete("/:id", [validateToken, validateAdmin],  deleteMovie);

module.exports = router;