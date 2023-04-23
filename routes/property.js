const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/property");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.post("/search", ensureAuth, propertyController.searchProperty);
router.post("/comps", propertyController.compProperty);
router.get("/comps", propertyController.getProperty);



module.exports = router;
