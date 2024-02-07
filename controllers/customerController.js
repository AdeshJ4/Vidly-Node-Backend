const mongoose = require("mongoose");
const { Customer, validateCustomer } = require("../models/customerModel");
const emailService = require("../utils/emailService");

const pageSize = 10;
/*
    1. @desc : Get All Customers
    2. @route GET : /api/customers?pageNumber=2
    3. @access public
*/
const getCustomers = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1; // Get the requested page (default to page 1 if not provided)
    const count = await Customer.countDocuments(); // Count total number of documents in the collection
    const customers = await Customer.find()
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    return res.status(200).json({ count, customers }); // Return total count along with paginated movies
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid Email & Password");
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
1. @desc : Get Customers By Membership
2. @route GET : api/customers/membership/'Gold'?pageNumber=1
3. @access private
*/
const getCustomersByMembership = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const membership = req.params.membership;
    const count = await Customer.countDocuments({ "membership": membership });
    const customers = await Customer.find({ "membership": membership })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    console.log("customers: ", customers);
    console.log("count: ", count);
    return res.status(200).json({ count, customers });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};



/*
1. @desc : Get Movies By Search Input
2. @route GET : api/customers/search/:customerName?pageNumber=1
3. @access private
*/
const getCustomersBySearch = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;

    const customerName = req.params.customerName;
    const regex = new RegExp(customerName, "i"); // Case-insensitive regex for partial match

    // Search for movies with similar names
    const count = await Customer.countDocuments({ name: regex });
    const customers = await Customer.find({ name: regex })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    return res.status(200).json({ count, customers });
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
      email: req.body.email,
      membership: req.body.membership,
    });

    // send emil to customer
    let subject = `Welcome to Vidly - Registration Successful.`;
    let text = `Dear ${customer.name},

    Thank you for registering with Vidly! We are excited to welcome you to our community.
    Your account has been successfully created, and you can now enjoy the benefits of being a member. If you have any questions 
    or need assistance, feel free to reach out to our support team.
    
    Your Customer Id : ${customer._id}
    
    Best regards,
    Vidly Team
    `;
    // emailService.sendEmail(customer.email, subject, text);

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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
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
  getCustomersByMembership,
  getCustomersBySearch,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
