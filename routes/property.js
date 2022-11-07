const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/property");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Simple router for now, no liking properties just get viewing info working
router.post("/search", propertyController.searchProperty);

//Can just display through modal as opposed to pagination
// router.get("/building", propertyController.getBuilding)


module.exports = router;
