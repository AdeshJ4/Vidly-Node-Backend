const mongoose = require("mongoose");
const Joi = require("joi");
const { customerSchema } = require("./customerModel");

const rentalSchema = mongoose.Schema({
  customer: {
    type: customerSchema,
    required: [true, "Customer Details are required"],
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
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
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

const rentalValidation = (rental) => {
  const joiSchema = Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
  });

  return joiSchema.validate(rental);
};

exports.Rental = mongoose.model("Rental", rentalSchema);
exports.rentalValidation = rentalValidation;
