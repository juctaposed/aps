const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer"); //prob dont need
const propertyController = require("../controllers/property");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// Simple router for now, no liking properties just get viewing info working
router.post("/search", propertyController.searchProperty);



module.exports = router;
