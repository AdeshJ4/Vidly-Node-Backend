const express = require("express");
const router = express.Router();

const {
  getGenre,
  getGenres,
  createGenre,
  updateGenre,
  deleteGenre,
} = require("../controllers/genresController");

const validateToken = require('../middlewares/validateTokenHandler');
const isAdmin= require('../middlewares/validateAdmin');

router.get("/", getGenres);

router.get("/:id", getGenre);

router.post("/", validateToken, createGenre);

router.put("/:id", validateToken, updateGenre);

// you must be Admin to delete this Genre.
router.delete("/:id", [validateToken, isAdmin], deleteGenre); 

module.exports = router;
