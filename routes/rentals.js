const express = require('express');
const router = express.Router();

const { getRentals, getRental, createRental } = require('../controllers/rentalsController');

const validateToken = require('../middlewares/validateTokenHandler');

router.use(validateToken);

router.get('/', getRentals);

router.get('/:id', getRental);

router.post('/', createRental);

module.exports = router;
