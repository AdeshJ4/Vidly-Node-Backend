const mongoose = require("mongoose");
const { Movie, validateMovie } = require("../models/movieModel");
const { Genre } = require("../models/genreModel");

const pageSize = 10;
/*
1. @desc : Get All Movies
2. @route GET : /api/movies?pageNumber=2
3. @access private
*/
const getMovies = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1; // Get the requested page (default to page 1 if not provided)
    const count = await Movie.countDocuments(); // Count total number of documents in the collection
    const movies = await Movie.find()
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    return res.status(200).json({ count, movies }); // Return total count along with paginated movies
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

/*
1. @desc : Get Movies By Genre
2. @route GET : api/movies/genre/Comedy?pageNumber=1
3. @access private
*/
const getMoviesByGenre = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const genre = req.params.genre;
    const count = await Movie.countDocuments({ "genre.name": genre });
    const movies = await Movie.find({ "genre.name": genre })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    console.log("movies: ", movies);
    console.log("count: ", count);
    return res.status(200).json({ count, movies });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
/*
1. @desc : Get Movies By Search Input
2. @route GET : api/movies/search/:movieName?pageNumber=1
3. @access private
*/
const getMoviesBySearch = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;

    const movieName = req.params.movieName;
    const regex = new RegExp(movieName, "i"); // Case-insensitive regex for partial match

    // Search for movies with similar names
    const count = await Movie.countDocuments({ title: regex });
    const movies = await Movie.find({ title: regex })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

      console.log(movies);
    return res.status(200).json({ count, movies });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

/*
    1. @desc : Get Movie
    2. @route GET : /api/movies/:id
    3. @access public
*/
const getMovie = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send(`Incorrect movieID`);
    }

    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).send(`Movie not found`);
    }
    return res.status(200).send(movie);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

/*
    1. @desc : Create Movie
    2. @route POST : /api/movies/:id
    3. @access public
*/
const createMovie = async (req, res) => {
  try {
    const { error } = validateMovie(req.body);
    if (error) {
      console.log(error.details[0].message);
      return res.status(400).send(error.details[0].message);
    }

    // hybrid approach
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) {
      return res.status(404).send("Genre Not found");
    }

    const movie = await Movie.create({
      title: req.body.title,
      /**
       * you will ask why we don't use this genre property to genre which we fetch from Genre COllection
       * genre: genre;
       * -> because this genre object which we fetch from Genre collection also has a version property that is set to mongoDB
       * that we don't want to include : ("__v": 0)
       * -> Also in more complex application the genre object we load from Genre Collection could have 50 properties, we don't want
       * to store all those properties inside our genre property, when embedding that document inside a movie document thats why
       * we selectively properties here.
       * -> we are setting _id: genre_id;
       * -> we store _id: genre_id because in future perhaps we need more information about genre that is not available in this
       * movie document so we can query that genre later in Genre Collection.
       * -> another reason is that in future if we want to find all movies which have genre "action". at the time of
       * creating a movie we set genre object _id property to _id property of a genre object which we fetch from
       * Genre collection. if we don't write this line (_id: genre._id) then mongoDB will set unique _id for every genre in movie
       * document and it will difficult to find movie documents based on genre property such as "find all movies which have genre:action"
       */
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });

    return res.status(201).send(movie);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

/*
    1. @desc : Update Movie
    2. @route PUT : /api/movies/:id
    3. @access public
*/
const updateMovie = async (req, res) => {
  console.log(req.body);
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid ObjectId");
    }
    const { error } = validateMovie(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) {
      return res.status(404).send("Genre Not Found");
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
      return res.status(404).send("Movie not found");
    }

    return res.status(200).send(movie);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

/*
    1. @desc : Delete Movie
    2. @route DELETE : /api/movies/:id
    3. @access public
*/

const deleteMovie = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid movieId");
    }

    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).send("Movie Not found");
    }

    return res.status(200).send(movie);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

module.exports = {
  getMovie,
  getMovies,
  getMoviesByGenre,
  getMoviesBySearch,
  createMovie,
  updateMovie,
  deleteMovie,
};

// const getMovies = async (req, res) => {
//   try {
//     const pageNumber = parseInt(req.query.pageNumber) || 1; // Get the requested page (default to page 1 if not provided)
//     const pageSize = 10;
//     const movies = await Movie.find()
//       .skip((pageNumber - 1) * pageSize)
//       .limit(pageSize);
//     return res.status(200).json(movies);
//   } catch (err) {
//     return res.status(500).send(err.message);
//   }
// };
