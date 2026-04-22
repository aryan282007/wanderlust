const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const Listing = require("../modals/listing.js");
const { isLoggedIn , isOwner, validateListing} = require("../middleware.js");

router.get("/", asyncWrap(async (req,res)=>{
  const allListing = await Listing.find({});
  res.render("listing/index", { allListing });
}));

router.get("/new",isLoggedIn,(req,res)=>{
  res.render("listing/new.ejs");
})

router.post("/",isLoggedIn,validateListing, async (req,res,next)=>{
  let newlist = new Listing(req.body.listing);
  newlist.owner = req.user._id;
  await newlist.save();
  req.flash("success","new Listing created!");
  console.log(newlist);
  res.redirect("/listings");
});

router.get("/:id/edit",isOwner,isLoggedIn,asyncWrap(async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
   if(!listing){
     req.flash("error","Listing not found!");
     return res.redirect("/listings");
  }
  res.render("listing/edit.ejs",{listing});
}));

router.put("/:id",isLoggedIn,isOwner, validateListing, asyncWrap(async (req,res)=>{
  if(!req.body.listing){
    throw new ExpressError("send valid data for listing",400);
  }
  let {id} = req.params;
  const listing = await Listing.findByIdAndUpdate(id,{...req.body.listing},{ new: true });
  req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);
}));

router.get("/:id", asyncWrap(async (req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
  if(!listing){
     req.flash("error","Listing not found!");
     return res.redirect("/listings");
  }
  res.render("listing/show.ejs", {listing});
}));

router.delete("/:id",isOwner,isLoggedIn,asyncWrap(async(req,res)=>{
  let {id} = req.params;
   const listing = await Listing.findByIdAndDelete(id);
   console.log(listing);
   req.flash("success","Listing deleted!");
   res.redirect("/listings");
}));


module.exports = router;