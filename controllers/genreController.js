const mongoose = require("mongoose");
const { Genre, validateGenre } = require("../models/genreModel");
const { Movie, validateMovie } = require("../models/movieModel");

/*
    1. @desc : Get All Genre
    2. @route GET : /api/genres
    3. @access public
*/
const getGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    return res.status(200).send(genres);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};



/*
    1. @desc : Get Single Genre
    2. @route GET : /api/genres/:id
    3. @access public
*/
const getGenre = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid GenreID");
    }
    const genre = await Genre.findById(req.params.id);
    if (!genre)
      return res
        .status(404)
        .send(`The genre with given id ${req.param.is} not found`);
        return res.status(200).send(genre);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};




/*
    1. @desc : Post Genre
    2. @route Post : /api/genres
    3. @access private
*/
const createGenre = async (req, res) => {
  try {
    /**
     * -> here we are using our Joi.validate() function, so if thr name, email, or other properties are not validate then we are
     * going to return 400 error to the user
     */
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.create({
      name: req.body.name,
    });

    return res.status(201).send(genre);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};



/*
    1. @desc : update Genre
    2. @route PUT : /api/genres/:id
    3. @access private
*/
const updateGenre = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid GenreID");
    }

    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!genre) {
      return res
        .status(404)
        .send(`The genre with given id ${req.param.id} not found`);
    }

    // update genre in movie api also
    await Movie.updateMany({'genre._id': req.params.id}, {
      $set: {
        'genre.name': req.body.name
      }
    })

    return res.status(200).send(genre);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};



/*
    1. @desc : Delete Single Genre
    2. @route DELETE : /api/genres
    3. @access private
*/
const deleteGenre = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid GenreID");
    }
    
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) {
      return res
        .status(404)
        .send(`The Genre with given id ${req.params.id} not found`);
    }
    return res.status(200).send(genre);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

module.exports = { getGenre, getGenres, createGenre, updateGenre, deleteGenre };
