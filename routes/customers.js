// customer can only be created by user(employee)

const express = require("express");
const router = express();
const {getCustomer, getCustomers, getCustomersBySearch, createCustomer, updateCustomer, deleteCustomer, getCustomersByMembership} = require('../controllers/customerController');

const validateToken = require('../middlewares/validateTokenHandler');
const validateAdmin = require('../middlewares/validateAdmin');

router.use(validateToken);

// get Single Customer
router.get('/:id', getCustomer);

// get all the customers
router.get('/', getCustomers);

// get customers according to membership
router.get("/membership/:membership", getCustomersByMembership);

// get customers according to search
router.get("/search/:customerName", getCustomersBySearch);

// create Customer
router.post('/',createCustomer );

//update customer
router.put('/:id', updateCustomer);

// delete customer
router.delete('/:id', validateAdmin, deleteCustomer);


module.exports = router;
