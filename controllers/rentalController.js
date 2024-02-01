const { Rental, validateRental } = require("../models/rentalModel");
const { Customer } = require("../models/customerModel");
const { Movie } = require("../models/movieModel");
const mongoose = require("mongoose");
const emailService = require("../utils/emailService");

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

/*
Transactions help ensure the consistency of data across multiple operations and allow you to rollback changes if an error occurs in 
any part of the transaction.

-> We use session to start and manage the transaction.
-> The abortTransaction() method is called if there's an error, rolling back any changes made during the transaction.
-> The commitTransaction() method is called to commit the changes if the transaction is successful.
-> The session.endSession() method is called to end the session after the transaction.
-> This ensures that either all changes are applied, or none are, maintaining data integrity. Make sure your MongoDB server supports 
transactions, as some configurations may not support them.
*/

const createRental = async (req, res) => {
  try {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(404).send("Customer Not Found");

    const movies = await Movie.find({ _id: { $in: req.body.movies } });
    console.log('movies', movies);
    if (movies.length !== req.body.movies.length)
      return res.status(404).send("One or more movies not found");

    for (const movie of movies) {
      if (movie.numberInStock === 0)
        return res.status(400).send(`Movie ${movie.title} is not in stock`);
    }

    const rentalMovies = movies.map((movie) => ({
      _id: movie._id,
      title: movie.title,
      genre: movie.genre.name,
      dailyRentalRate: movie.dailyRentalRate,
    }));

    const rental = await Rental.create({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        isGold: customer.isGold,
      },
      movies: rentalMovies,
      dateReturned: req.body.dateReturned,
      rentalFee: rentalMovies.reduce(
        (total, movie) => total + movie.dailyRentalRate,
        0
      ),
    });

    for (const movie of movies) {
      movie.numberInStock--;
      await movie.save();
    }

    console.log('subject');
    // send email to customer
    let subject = `Movie Rental Details - Thank You for Choosing Vidly`;
    let text = `Dear ${customer.name},

    Thank you for choosing Vidly for your movie rental needs. Here are the details of the movies you have rented:
    
    Rental ID: ${rental._id}
    Customer ID: ${customer._id}
    Date of Rental: ${rental.dateOut}
    
    Movies Rented:
    ${rentalMovies
      .map(
        (movie, index) => `${index + 1}. Movie Title: ${movie.title}
       Genre: ${movie.genre.name}
       Rental Fee: ${movie.dailyRentalRate}
    `
      )
      .join("")}
    
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

// original 2
// const createRental = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { error } = validateRental(req.body);
//     if (error) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).send(error.details[0].message);
//     }

//     const customer = await Customer.findById(req.body.customerId).session(
//       session
//     );
//     if (!customer) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).send("Customer Not Found");
//     }

//     const movies = await Movie.find({ _id: { $in: req.body.movies } }).session(
//       session
//     );
//     console.log("movies", movies);
//     if (movies.length !== req.body.movies.length) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).send("One or more movies not found");
//     }

//     for (const movie of movies) {
//       if (movie.numberInStock === 0) {
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(400).send(`Movie ${movie.title} is not in stock`);
//       }
//     }

//     const rentalMovies = movies.map((movie) => ({
//       _id: movie._id,
//       title: movie.title,
//       dailyRentalRate: movie.dailyRentalRate,
//     }));

//     const rental = await Rental.create(
//       [
//         {
//           customer: {
//             _id: customer._id,
//             name: customer.name,
//             phone: customer.phone,
//             email: customer.email,
//             isGold: customer.isGold,
//           },
//           movies: rentalMovies,
//           dateReturned: req.body.dateReturned,
//           rentalFee: rentalMovies.reduce(
//             (total, movie) => total + movie.dailyRentalRate,
//             0
//           ),
//         },
//       ],
//       { session }
//     );

//     for (const movie of movies) {
//       movie.numberInStock--;
//       await movie.save();
//     }

//     await session.commitTransaction();
//     session.endSession();

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
//        Genre: ${movie.genre.name}
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
//     emailService.sendEmail(customer.email, subject, text);
//     return res.status(200).send(rental);
//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     return res.status(500).send(err.message);
//   }
// };

// original 1
// const createRental = async (req, res) => {
//   try {
//     const { error } = validateRental(req.body);
//     if (error) return res.status(400).send(error.details[0].message);

//     const customer = await Customer.findById(req.body.customerId);
//     if (!customer) return res.status(404).send("Customer Not Found");

//     const movie = await Movie.findById(req.body.movieId);
//     if (!movie) return res.status(404).send("Movie Not Found");

//     if (movie.numberInStock === 0)
//       return res.status(400).send("Movie Not in stock");

//     const rental = await Rental.create({
//       /**
//        * -> we store _id: customer._id because in future perhaps we need more information about customer that is not available in this
//        * rental document so we can query that customer later in Customer Collection.
//        */
//       customer: {
//         _id: customer._id,
//         name: customer.name,
//         phone: customer.phone,
//         email: customer.email,
//         isGold: customer.isGold
//       },
//       movie: {
//         _id: movie._id,
//         title: movie.title,
//         dailyRentalRate: movie.dailyRentalRate,
//       },
//       dateReturned: req.body.dateReturned,
//       rentalFee: movie.dailyRentalRate
//     });

//     movie.numberInStock--;
//     await movie.save();

//     // send emil to customer
//     let subject = `Movie Rental Details - Thank You for Choosing Vidly`;
//     let text = `Dear ${customer.name},

//     Thank you for choosing Vidly for your movie rental needs. Here are the details of the movies you have rented:

//     Rental ID: ${rental._id}
//     Customer ID: ${customer._id}
//     Date of Rental: ${rental.dateOut}

//     Movies Rented:
//     1. Movie Title: ${movie.title}
//        Genre: ${movie.genre.name}
//        Rental Fee: ${movie.dailyRentalRate}

//     Total Rental Fee: ${rental.rentalFee}
//     Date Return: ${rental.dateReturned}

//     Please ensure to return the movies by the specified return date to avoid any late fees. If you have any questions or concerns, feel free to contact our customer support.

//     Thank you again for choosing Vidly. We hope you enjoy your movie-watching experience!

//     Best regards,
//     Vidly Team

//     `;
//     emailService.sendEmail(customer.email, subject, text);
//     return res.status(200).send(rental);

//   } catch (err) {
//     return res.status(500).send(err.message);
//   }
// };

module.exports = { getRental, getRentals, createRental };
