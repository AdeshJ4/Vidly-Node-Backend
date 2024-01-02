const { Rental, validateRental } = require("../models/rentalModel");
const { Customer } = require("../models/customerModel");
const { Movie } = require("../models/movieModel");
const mongoose = require("mongoose");

// const Fawn = require("fawn");

// Fawn.init("mongodb://127.0.0.1/playGround");

/*
    1. @desc : Get All rentals
    2. @route GET : /api/rentals
    3. @access public
*/

const getRentals = async (req, res) => {
  try {
    const rentals = await Rental.find().sort("-dateOut"); // -dateOut in descending order
    res.status(200).send(rentals);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

/*
    1. @desc : Get rental
    2. @route GET : /api/rentals/:id
    3. @access public
*/

const getRental = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).send("Invalid Rental Id");

    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).send("rental Not Found");

    res.status(200).send(rental);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

/*
    1. @desc : post rental
    2. @route POST : /api/rentals/:id
    3. @access public
*/

const createRental = async (req, res) => {
  try {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(404).send("Customer Not Found");

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(404).send("Movie Not Found");

    if (movie.numberInStock === 0)
      return res.status(400).send("Movie Not in stock");

    const rental = await Rental.create({
      /**
       * -> we store _id: customer._id because in future perhaps we need more information about customer that is not available in this
       * rental document so we can query that customer later in Customer Collection.
       */
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
      dateReturned: req.body.dateReturned,
    });

    movie.numberInStock--;
    await movie.save();
    res.status(200).send(rental);
    
  } catch (err) {
    res.status(500).send(err.message);
  }
};


module.exports = {getRental, getRentals, createRental};