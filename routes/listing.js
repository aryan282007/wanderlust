const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const Listing = require("../modals/listing.js");
const { isLoggedIn , isOwner, validateListing} = require("../middleware.js");
const ListingController = require("../controller/listing.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage: storage });

router.route("/")
.get(asyncWrap(ListingController.index))
.post(isLoggedIn, validateListing, upload.single("listing[image]"), asyncWrap(ListingController.createListing));

router.get("/new",isLoggedIn ,ListingController.newListing);

router.route("/:id")
.get(asyncWrap(ListingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"), validateListing, asyncWrap(ListingController.updateListing))
.delete(isOwner,isLoggedIn,asyncWrap(ListingController.destroyListing));

router.get("/:id/edit",isOwner,isLoggedIn,asyncWrap(ListingController.editListing));


module.exports = router;