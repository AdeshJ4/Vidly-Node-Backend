const asyncHandler = require("express-async-handler");
const { Rental, rentalValidation } = require("../models/rentalModel");
const { Customer } = require("../models/customerModel");
const { Movie } = require("../models/movieModel");
const mongoose = require("mongoose");

const getRental = asyncHandler(async (req, res) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid RentalId");
  }

  const rental = await Rental.findById(req.params.id);
  if (!rental) {
    res.status(404);
    throw new Error("Rental Not Fund");
  }

  res.status(200).send(rental);
});

const getRentals = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid RentalId");
  }
  const rentals = await Rental.find().sort("-dateOut");
  res.status(200).send(rentals);
});

const createRental = asyncHandler(async (req, res) => {
  const { error } = rentalValidation(req.body);

  // if(!mongoose.Types.ObjectId.isValid(req.body.customerId)){
  //   res.status(400);
  //   throw new Error('Invalid CustomerId');
  // }

  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) {
    res.status(404);
    throw new Error("Customer Not Found");
  }

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) {
    res.status(404);
    throw new Error("Movie Not Found");
  }

  if (movie.numberInStock === 0) {
    return res.status(400).send("Movie not in stock.");
  }

  let rental = new Rental({
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
  });

  rental = await rental.save();
  movie.numberInStock--;
  movie.save();

  res.status(201).send(rental);

});

module.exports = { getRental, getRentals, createRental };
