const express = require("express");
//create router object
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const contactController = require("../controllers/contact");
const aboutController = require("../controllers/about")
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, homeController.getProfile); 
// router.get("/recent", ensureAuth, postsController.getRecent);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.get("/contact", contactController.getContact)
router.get("/about", aboutController.getAbout)

module.exports = router;
