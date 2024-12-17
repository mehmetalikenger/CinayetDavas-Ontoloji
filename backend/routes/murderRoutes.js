const express = require("express");
const router = express.Router();
const murderController = require("../controllers/murderController");

// API ana sayfası
router.get("/", (req, res) => {
  res.send("Welcome to the SPARQL API!");
});

// Tüm cinayet verilerini getir
router.get("/murders", murderController.getAllMurders);

// Belirli bir ID'ye göre cinayet verisini getir
router.get("/murders/:id", murderController.getMurderById);

// DBpedia'dan cinayet davalarını getir
router.get("/murder-cases", murderController.getMurderCases);

module.exports = router;
