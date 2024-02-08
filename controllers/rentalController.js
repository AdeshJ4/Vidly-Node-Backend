const { Rental, validateRental } = require("../models/rentalModel");
const { Customer } = require("../models/customerModel");
const { Movie } = require("../models/movieModel");
const mongoose = require("mongoose");
const emailService = require("../utils/emailService");

const pageSize = 10;
/*
    1. @desc : Get All rentals
    2. @route GET : /api/rentals
    3. @access public
*/
const getRentals = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1; // Get the requested page (default to page 1 if not provided)
    const count = await Rental.countDocuments(); // Count total number of documents in the collection
    const rentals = await Rental.find()
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    return res.status(200).json({ count, rentals }); // Return total count along with paginated movies
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

    return res.status(200).json({ count: 1, rentals: [rental] });
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

    // Check membership level and apply corresponding rules
    let maxRentalLimit;
    let discount;

    switch (customer.membership) {
      case "Bronze":
        maxRentalLimit = 3;
        discount = 0.05; // 5% discount for Bronze membership
        break;
      case "Silver":
        maxRentalLimit = 5;
        discount = 0.08; // 8% discount for Silver membership
        break;
      case "Gold":
        maxRentalLimit = 10;
        discount = 0.1; // 10% discount for Gold membership
        break;
      default:
        // Normal Membership (No Membership)
        maxRentalLimit = 2;
        lateSubmissionFee = 10;
        discount = 0; // No discount offered
        break;
    }

    // Check if the number of movies being rented exceeds the maximum rental limit
    if (req.body.movies.length > maxRentalLimit) {
      return res
        .status(400)
        .send(`You can only rent up to ${maxRentalLimit} movies at a time`);
    }

    // Check if all movies are available for rental
    const movies = await Movie.find({ _id: { $in: req.body.movies } });
    if (movies.length !== req.body.movies.length)
      return res.status(404).send("One or more movies not found");
    // check if any movie is out of stock or not
    const unavailableMovies = movies.filter(
      (movie) => movie.numberInStock === 0
    );
    if (unavailableMovies.length > 0) {
      const unavailableMovieTitles = unavailableMovies
        .map((movie) => movie.title)
        .join(", ");
      return res
        .status(400)
        .send(
          `The following movies are not in stock: ${unavailableMovieTitles}`
        );
    }

    // total rental fee
    const rentalFee = movies.reduce(
      (total, movie) => total + movie.dailyRentalRate,
      0
    );

    const totalFee = rentalFee;

    // Apply discount
    totalFee = totalFee - (totalFee * discount)

   

    // If all validations pass, create the rental and send the response
    const rentalMovies = movies.map((movie) => ({
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    }));

    const rental = await Rental.create({
      customer: {
        _id: customer._id,
        name: customer.name,
        membership: customer.membership,
      },
      movies: rentalMovies,
      dateReturned: req.body.dateReturned,
      rentalFee: rentalFee,
      totalFee: totalFee,
    });

    for (const movie of movies) {
      movie.numberInStock--;
      await movie.save();
    }

    // Send email to customer and return the rental details
    // emailService.sendEmail(customer.email, subject, text);
    return res.status(200).send(rental);
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).send("Internal Server Error");
  }
};

// const createRental = async (req, res) => {
//   try {
//     const { error } = validateRental(req.body);
//     if (error) return res.status(400).send(error.details[0].message);

//     const customer = await Customer.findById(req.body.customerId);
//     if (!customer) return res.status(404).send("Customer Not Found");
//     console.log("customer: ", customer);

//     const movies = await Movie.find({ _id: { $in: req.body.movies } });
//     console.log("Movies: ", movies);

//     if (movies.length !== req.body.movies.length)
//       return res.status(404).send("One or more movies not found");

//     for (const movie of movies) {
//       if (movie.numberInStock === 0)
//         return res.status(400).send(`Movie ${movie.title} is not in stock`);
//     }
//     console.log("I am Here 1");

//     const rentalMovies = movies.map((movie) => ({
//       _id: movie._id,
//       title: movie.title,
//       dailyRentalRate: movie.dailyRentalRate,
//     }));
//     console.log("I am Here 2");

//     const rental = await Rental.create({
//       customer: {
//         _id: customer._id,
//         name: customer.name,
//         membership: customer.membership,
//       },
//       movies: rentalMovies,
//       dateReturned: req.body.dateReturned,
//       rentalFee: rentalMovies.reduce(
//         (total, movie) => total + movie.dailyRentalRate,
//         0
//       ),
//     });
//     console.log("I am Here 3");

//     for (const movie of movies) {
//       movie.numberInStock--;
//       await movie.save();
//     }
//     console.log("I am Here 4");

//     // send email to customer
//     let subject = `Movie Rental Details - Thank You for Choosing Vidly`;
//     let text = `Dear ${customer.name},

//     Thank you for choosing Vidly for your movie rental needs. Here are the details of the movies you have rented:

//     Rental ID: ${rental._id}
//     Customer ID: ${customer._id}
//     Date of Rental: ${rental.dateOut}

//     Movies Rented:
//     ${rentalMovies
//       .map(
//         (movie, index) => `${index + 1}. Movie Title: ${movie.title}
//        Rental Fee: ${movie.dailyRentalRate}
//     `
//       )
//       .join("")}

//     Total Rental Fee: ${rental.rentalFee}
//     Date Return: ${rental.dateReturned}

//     Please ensure to return the movies by the specified return date to avoid any late fees. If you have any questions or concerns, feel free to contact our customer support.

//     Thank you again for choosing Vidly. We hope you enjoy your movie-watching experience!

//     Best regards,
//     Vidly Team

//     `;

//     // emailService.sendEmail(customer.email, subject, text);
//     return res.status(200).send(rental);
//   } catch (err) {
//     console.log("I am inside catch block", err);
//     return res.status(500).send(err);
//   }
// };

module.exports = { getRental, getRentals, createRental };
