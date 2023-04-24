const express = require('express');
const router = express.Router();
const { getCustomer, getCustomers, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customersController');

const validateToken = require('../middlewares/validateTokenHandler');
const isAdmin= require('../middlewares/validateAdmin');

router.get('/', getCustomers);

router.get('/:id', getCustomer);

router.post('/', validateToken,  createCustomer);

router.put('/:id', validateToken, updateCustomer);

router.delete('/:id', validateToken, deleteCustomer);


module.exports = router;