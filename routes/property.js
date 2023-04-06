const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/property");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.post("/search", propertyController.searchProperty);
router.post("/comps", propertyController.compProperty);



module.exports = router;
