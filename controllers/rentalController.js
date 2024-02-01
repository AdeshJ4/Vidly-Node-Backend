const { Rental, validateRental } = require("../models/rentalModel");
const { Customer } = require("../models/customerModel");
const { Movie } = require("../models/movieModel");
const mongoose = require("mongoose");
const emailService = require('../utils/emailService');

/*
    1. @desc : Get All rentals
    2. @route GET : /api/rentals
    3. @access public
*/

const getRentals = async (req, res) => {
  try {
    const rentals = await Rental.find().sort("-dateOut"); // -dateOut in descending order
    return res.status(200).send(rentals);
  } catch (err) {
    return res.status(500).send(err.message);
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

    return res.status(200).send(rental);
  } catch (err) {
    return res.status(500).send(err.message);
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
        email: customer.email,
        isGold: customer.isGold
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
      dateReturned: req.body.dateReturned,
      rentalFee: movie.dailyRentalRate
    });

    movie.numberInStock--;
    await movie.save();


    // send emil to customer
    let subject = `Movie Rental Details - Thank You for Choosing Vidly`;
    let text = `Dear ${customer.name},

    Thank you for choosing Vidly for your movie rental needs. Here are the details of the movies you have rented:
    
    Rental ID: ${rental._id}
    Customer ID: ${customer._id}
    Date of Rental: ${rental.dateOut}
    
    Movies Rented:
    1. Movie Title: ${movie.title}
       Genre: ${movie.genre.name}
       Rental Fee: ${movie.dailyRentalRate}
  
    
    Total Rental Fee: ${rental.rentalFee}
    Date Return: ${rental.dateReturned}
    
    Please ensure to return the movies by the specified return date to avoid any late fees. If you have any questions or concerns, feel free to contact our customer support.
    
    Thank you again for choosing Vidly. We hope you enjoy your movie-watching experience!
    
    Best regards,
    Vidly Team
    
    `;
    emailService.sendEmail(customer.email, subject, text);
    return res.status(200).send(rental);
    
  } catch (err) {
    return res.status(500).send(err.message);
  }
};


module.exports = {getRental, getRentals, createRental};