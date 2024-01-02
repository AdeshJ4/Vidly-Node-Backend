const express = require("express");
const router = express();
const { getRental, getRentals, createRental } = require('../controllers/rentalController');

const validateToken = require('../middlewares/validateTokenHandler');

router.use(validateToken);

router.get("/", getRentals);

router.get("/:id", getRental);

// create a rental
router.post("/", createRental);

module.exports = router;
