const mongoose = require("mongoose");
const { Customer, validateCustomer } = require("../models/customerModel");

/*
    1. @desc : Get All Customers
    2. @route GET : /api/customers?pageNumber=2
    3. @access public
*/
const getCustomers = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1; // Get the requested page (default to page 1 if not provided)
    const pageSize = 10;
    const customers = await Customer.find().skip((pageNumber - 1) * pageSize).limit(pageSize);
    return res.status(200).json(customers);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};


/*
    1. @desc : Get Single Customer
    2. @route GET : /api/customers/:id
    3. @access public
*/

const getCustomer = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)){
      return res.status(400).send("Invalid CustomerID");
    }

    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res
        .status(404)
        .send(`The customer with given id ${req.params.id} not found`);
    }

    return res.status(200).send(customer);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

/*
    1. @desc : Create Customer
    2. @route POST : /api/customers
    3. @access public
*/
const createCustomer = async (req, res) => {
  try {
    const { error } = validateCustomer(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const customer = await Customer.create({
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    });

    return res.status(201).send(customer);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

/*
    1. @desc : Update Customer
    2. @route UPDATE : /api/customers/:id
    3. @access public
*/
const updateCustomer = async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)){
      return res.status(400).send("Invalid CustomerID");
    }

    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!customer)
      return res
        .status(404)
        .send(`The Customer with given id ${req.params.id} not found`);

      return res.status(200).send(customer);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

/*
    1. @desc : delete Customer
    2. @route DELETE : /api/customers/:id
    3. @access public
*/
const deleteCustomer = async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)){
      return res.status(400).send("Invalid CustomerID");
    }


    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res
        .status(404)
        .send(`The Customer with given id ${req.params.id} not found`);
    }

    return res.status(200).send(customer);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};


module.exports = {
  getCustomer,
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
