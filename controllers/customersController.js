const { Customer, validateCustomer } = require("../models/customerModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const getCustomer = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid CustomerId");
  }
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    res.status(404);
    throw new Error("Customer Not Found");
  }

  res.status(200).send(customer);
});

const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find();
  res.status(200).send(customers);
});

const createCustomer = asyncHandler(async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const customer = await Customer.create({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  res.status(201).send(customer);
});

const updateCustomer = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid CustomerId");
  }
  const { error } = validateCustomer(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!customer) {
    res.status(404);
    throw new Error("Customer Not Found");
  }

  res.status(200).send(customer);
});

const deleteCustomer = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid CustomerId");
  }
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) {
    res.status(404);
    throw new Error("Customer Not Found");
  }

  res.status(200).send(customer);
});

module.exports = {
  getCustomer,
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
