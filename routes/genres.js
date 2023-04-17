const express = require("express");
const router = express.Router();

const {
  getGenre,
  getGenres,
  createGenre,
  updateGenre,
  deleteGenre,
} = require("../controllers/genresController");

router.get("/", getGenres);

router.get("/:id", getGenre);

router.post("/", createGenre);

router.put("/:id", updateGenre);

router.delete("/:id", deleteGenre);

module.exports = router;
