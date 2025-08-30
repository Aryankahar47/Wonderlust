const express = require("express");
const router =express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js")
const listingController = require("../controllers/listings.js")
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })


//create route
router.post("/", upload.single('listing[image]'), isLoggedIn, validateListing, wrapAsync (listingController.createListing))




//index route
router.get("/", wrapAsync(listingController.index)
);


//new route (create new lists)
router.get("/new", isLoggedIn, listingController.createNew)


//show route (show the data of lists)
router.get("/:id", wrapAsync(listingController.showListing))


//update route
router.put("/:id", upload.single('listing[image]'), isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))


//delete route
router.delete("/:id", isLoggedIn, wrapAsync(listingController.destroyListing
))


//edit route
router.get("/:id/edit", isLoggedIn, wrapAsync (listingController.editListing))


module.exports = router;