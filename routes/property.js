const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/property");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Simple router for now, no liking properties just get viewing info working
router.post("/search", propertyController.searchProperty);
//FOR CREATING ENDPOINTS IN PROPERTY PAGE MODALS
// router.get("/search/countyTaxRecord/:parcelId", propertyController.getCountyTaxRecord);
// router.get("/search/buildingInfo/:parcelId", propertyController.getBuildingInfo);


// router.get("/search", propertyController.getBuildingInfo)

// 
//router.post("/search/bldg", controller.getBuildingInfo)
//router.post("/search/tax", controller.getTaxInfo)
//router.post("/search/owner", controller.getOwnerInfo)
//router.post("/search/comp", controller.getComparableProperties)

//Can just display through modal as opposed to pagination
// router.get("/building", propertyController.getBuilding)


module.exports = router;
