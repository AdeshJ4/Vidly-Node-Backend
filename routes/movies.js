const express = require('express');
const router = express.Router();
const { getMovie, getMovies, createMovie, updateMovie, deleteMovie } = require('../controllers/moviesController');


const validateToken = require('../middlewares/validateTokenHandler');

router.get('/:id', getMovie);

router.get('/', getMovies);

router.post('/', validateToken, createMovie);

router.put('/:id', validateToken, updateMovie);

router.delete('/:id', validateToken, deleteMovie);


module.exports = router;