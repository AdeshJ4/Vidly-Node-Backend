const express = require('express');
const router = express.Router();
const { getCustomer, getCustomers, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customersController');

router.get('/', getCustomers);

router.get('/:id', getCustomer);

router.post('/', createCustomer);

router.put('/:id', updateCustomer);

router.delete('/:id', deleteCustomer);


module.exports = router;