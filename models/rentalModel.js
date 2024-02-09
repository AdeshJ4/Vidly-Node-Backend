const mongoose = require("mongoose");
const Joi = require("joi");
const { customerSchema } = require("../models/customerModel");

/**
 * -> Implement api to manage rentals.
 * -> Create a new rental -> /api/rentals
 * -> Get a rental -> /api/rentals/:id
 *
 * -> customer is going to give its cusId to cashier and movie will have its own id printed on movie
 * -> so you don't have to ask its name and all other details and write again because user is already registered itself if not then
 * it have to.
 * -> to rent a movie we only need a customer id and movie id and when it rented and when it is going to returned.
 */

const customMovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Movie Name is required"],
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});

const customCustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 50,
  },
  membership: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    enum: ["normal", "bronze", "silver", "gold"],
  },
});

const rentalSchema = new mongoose.Schema({
  customer: {
    type: customCustomerSchema,
    required: [true, "Customer details are required"],
  },
  movies: {
    type: [customMovieSchema], // Array of customMovieSchema
    required: [true, "At least one movie is required"],
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  dateReturned: {
    type: Date,
    required: true,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
  totalFee: {
    type: Number,
    min: 0,
  },
});

/**
 * we already have movie schema but why we created new movie schema
 * ->because in movie schema we have a property called genre which is required and our rental document does not need genre property
 * because our movie property already have a genre property inside it.
 * -> Since genre property is required we can't omit it inside rental controller and we have to provide all properties of genre which
 * will cost performance issue because genre have nothing to do with rental object. we just need customerId , movieId, rented Date, returned date
 * -> now its just a single property which is defined as a "required: true "but in future we can have more required property which
 * have nothing to do with logic or model.
 */

// client side validation -> validate data coming form client
function validateRental(rental) {
  const joiSchema = Joi.object({
    customerId: Joi.objectId().required(),
    movies: Joi.array().items(Joi.objectId()).min(1).required(),
    dateReturned: Joi.date().required(),
  });

  return joiSchema.validate(rental);
}
const Rental = mongoose.model("Rental", rentalSchema);

module.exports = { Rental, validateRental };
