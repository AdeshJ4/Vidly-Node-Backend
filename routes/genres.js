/*
vidly is an imaginary backend service for renting out movies.

-> create a service for managing the list of genres : "http://vidly.com/api/genres"
-> Each movie have a genre like action, horror, etc
-> we should have a endpoint for getting all the list of genres because somewhere in our client routerlication 
we have dropdown list for user to select genre.
-> so we need endpoint to get all genres 
-> we also able to create a new genre as well as update or delete an existing one

 */

const express = require('express');
const router = express.Router();
const {getGenre, getGenres, createGenre, updateGenre, deleteGenre} = require('../controllers/genreController');
const validateToken = require('../middlewares/validateTokenHandler');
const validateAdmin = require('../middlewares/validateAdmin');

// get all genres
router.get('/', getGenres);

// get single genre
router.get('/:id', getGenre);

// post a genre
router.post('/', validateToken, createGenre);

// update a genre
router.put('/:id', validateToken, updateGenre);


// delete genre
router.delete('/:id', [validateToken, validateAdmin], deleteGenre);


module.exports = router;