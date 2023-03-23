const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/property");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.post("/search", propertyController.searchProperty);



module.exports = router;
