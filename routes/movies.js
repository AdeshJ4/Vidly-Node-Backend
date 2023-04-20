const express = require('express');
const router = express.Router();
const { getMovie, getMovies, createMovie, updateMovie, deleteMovie } = require('../controllers/moviesController');

router.get('/:id', getMovie);

router.get('/', getMovies);

router.post('/', createMovie);

router.put('/:id', updateMovie);

router.delete('/:id', deleteMovie);


module.exports = router;